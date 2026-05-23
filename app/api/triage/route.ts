import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TriageReport from "@/models/triage-report";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { toTriageReportRow } from "@/lib/triage-workflow";
import type { TriageListResponse } from "@/types/triage";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const search = searchParams.get("search")?.trim();

    const query: Record<string, unknown> = {};

    if (auth.role === "patient") {
      query.patientId = auth.userId;
    } else if (auth.role === "doctor") {
      query.doctorId = auth.userId;
    } else if (auth.role !== "admin") {
      return forbiddenResponse();
    }

    if (status && status !== "all") query.status = status;
    if (severity && severity !== "all") query.severity = severity;

    if (search && auth.role === "admin") {
      const regex = new RegExp(escapeRegex(search), "i");
      const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
      })
        .select("_id")
        .lean();
      const ids = users.map((u) => u._id);
      query.$or = [
        { symptoms: regex },
        { patientId: { $in: ids } },
        { doctorId: { $in: ids } },
      ];
    }

    const reports = await TriageReport.find(query).sort({ createdAt: -1 }).lean();

    const userIds = new Set<string>();
    reports.forEach((r) => {
      userIds.add(String(r.patientId));
      if (r.doctorId) userIds.add(String(r.doctorId));
    });

    const users = await User.find({ _id: { $in: [...userIds] } })
      .select("name email")
      .lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const rows = reports.map((r) =>
      toTriageReportRow(
        r,
        userMap.get(String(r.patientId)),
        r.doctorId ? userMap.get(String(r.doctorId)) : undefined
      )
    );

    return NextResponse.json<TriageListResponse>({
      success: true,
      reports: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("Triage GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load triage reports" },
      { status: 500 }
    );
  }
}
