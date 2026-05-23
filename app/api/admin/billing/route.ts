import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import Consultation from "@/models/consultation";
import Transaction from "@/models/transaction";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-auth";
import { syncTransactionsFromAppointments } from "@/lib/admin-sync";
import type {
  AdminBillingSummary,
  AdminErrorResponse,
  AdminTransactionRow,
  PaginatedResponse,
} from "@/types/admin";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    await syncTransactionsFromAppointments();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "15", 10))
    );

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
      })
        .select("_id")
        .lean();
      const userIds = users.map((u) => u._id);
      if (userIds.length === 0) {
        const summary = await buildSummary();
        return NextResponse.json({
          success: true,
          summary,
          ...emptyPage(page, pageSize),
        });
      }
      query.$or = [
        { patientId: { $in: userIds } },
        { doctorId: { $in: userIds } },
        { description: regex },
      ];
    }

    const summary = await buildSummary();
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const userIds = new Set<string>();
    transactions.forEach((t) => {
      userIds.add(String(t.patientId));
      userIds.add(String(t.doctorId));
    });

    const users = await User.find({ _id: { $in: [...userIds] } })
      .select("name")
      .lean();
    const userMap = new Map(users.map((u) => [String(u._id), u.name]));

    const items: AdminTransactionRow[] = transactions.map((t) => ({
      id: String(t._id),
      appointmentId: String(t.appointmentId),
      patientName: userMap.get(String(t.patientId)) ?? "Unknown",
      doctorName: userMap.get(String(t.doctorId)) ?? "Unknown",
      amount: t.amount,
      status: t.status,
      description: t.description,
      createdAt: t.createdAt
        ? new Date(t.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      summary,
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 0,
    });
  } catch (error) {
    console.error("Admin billing GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load billing data" },
      { status: 500 }
    );
  }
}

async function buildSummary(): Promise<AdminBillingSummary> {
  const [
    paidAgg,
    pendingAgg,
    totalConsultations,
    totalAppointments,
    totalTransactions,
  ] = await Promise.all([
    Transaction.aggregate<{ total: number }>([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate<{ total: number }>([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Consultation.countDocuments({ status: "completed" }),
    Appointment.countDocuments(),
    Transaction.countDocuments(),
  ]);

  const totalRevenue = paidAgg[0]?.total ?? 0;
  const pendingAmount = pendingAgg[0]?.total ?? 0;

  return {
    totalRevenue,
    totalConsultations,
    totalAppointments,
    totalBilled: totalRevenue + pendingAmount,
    paidTransactions: await Transaction.countDocuments({ status: "paid" }),
    pendingTransactions: await Transaction.countDocuments({ status: "pending" }),
  };
}

function emptyPage(page: number, pageSize: number) {
  return {
    items: [] as AdminTransactionRow[],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
  };
}
