import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Consultation from "@/models/consultation";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-auth";
import { syncConsultationsFromAppointments } from "@/lib/admin-sync";
import type {
  AdminConsultationRow,
  AdminErrorResponse,
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
    await syncConsultationsFromAppointments();

    const { searchParams } = new URL(req.url);
    const patientSearch = searchParams.get("patient")?.trim();
    const doctorSearch = searchParams.get("doctor")?.trim();
    const status = searchParams.get("status")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10))
    );

    let patientIds: string[] | null = null;
    let doctorIds: string[] | null = null;

    if (patientSearch) {
      const regex = new RegExp(escapeRegex(patientSearch), "i");
      const users = await User.find({
        role: "patient",
        $or: [{ name: regex }, { email: regex }],
      })
        .select("_id")
        .lean();
      patientIds = users.map((u) => String(u._id));
      if (patientIds.length === 0) {
        return NextResponse.json<PaginatedResponse<AdminConsultationRow>>({
          success: true,
          items: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        });
      }
    }

    if (doctorSearch) {
      const regex = new RegExp(escapeRegex(doctorSearch), "i");
      const users = await User.find({
        role: "doctor",
        $or: [{ name: regex }, { email: regex }],
      })
        .select("_id")
        .lean();
      doctorIds = users.map((u) => String(u._id));
      if (doctorIds.length === 0) {
        return NextResponse.json<PaginatedResponse<AdminConsultationRow>>({
          success: true,
          items: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        });
      }
    }

    const query: Record<string, unknown> = {};
    if (patientIds) query.patientId = { $in: patientIds };
    if (doctorIds) query.doctorId = { $in: doctorIds };
    if (status && status !== "all") query.status = status;

    const total = await Consultation.countDocuments(query);
    const consultations = await Consultation.find(query)
      .sort({ consultationDate: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const userIds = new Set<string>();
    consultations.forEach((c) => {
      userIds.add(String(c.patientId));
      userIds.add(String(c.doctorId));
    });

    const users = await User.find({ _id: { $in: [...userIds] } })
      .select("name email role")
      .lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const items: AdminConsultationRow[] = consultations.map((c) => {
      const patient = userMap.get(String(c.patientId));
      const doctor = userMap.get(String(c.doctorId));
      return {
        id: String(c._id),
        appointmentId: String(c.appointmentId),
        patientId: String(c.patientId),
        doctorId: String(c.doctorId),
        patientName: patient?.name ?? "Unknown",
        patientEmail: patient?.email ?? "",
        doctorName: doctor?.name ?? "Unknown",
        doctorEmail: doctor?.email ?? "",
        status: c.status,
        type: c.type,
        reason: c.reason,
        notes: c.notes,
        consultationDate: new Date(c.consultationDate).toISOString(),
        createdAt: c.createdAt
          ? new Date(c.createdAt).toISOString()
          : new Date().toISOString(),
      };
    });

    return NextResponse.json<PaginatedResponse<AdminConsultationRow>>({
      success: true,
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 0,
    });
  } catch (error) {
    console.error("Admin consultations GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load consultations" },
      { status: 500 }
    );
  }
}
