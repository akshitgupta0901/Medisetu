import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TriageReport from "@/models/triage-report";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { toTriageReportRow } from "@/lib/triage-workflow";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors or admins can view triage reports");
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (auth.role === "doctor") query.doctorId = auth.userId;
    if (patientId) query.patientId = patientId;
    if (severity && severity !== "all") query.severity = severity;
    if (status && status !== "all") query.status = status;

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

    return NextResponse.json({ success: true, reports: rows });
  } catch (error) {
    console.error("AI reports fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }

    const { reportId, doctorNotes, status } = await req.json();
    if (!reportId) {
      return NextResponse.json(
        { success: false, message: "Report ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    const report = await TriageReport.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    if (auth.role === "doctor" && String(report.doctorId) !== auth.userId) {
      return forbiddenResponse();
    }

    if (doctorNotes !== undefined) report.doctorNotes = String(doctorNotes);
    if (status) report.status = status;
    else if (report.status === "Assigned") report.status = "Under Review";
    else if (report.status === "Under Review") report.status = "Completed";

    await report.save();

    const patient = await User.findById(report.patientId).select("name email").lean();

    return NextResponse.json({
      success: true,
      report: toTriageReportRow(report.toObject(), patient ?? undefined),
      message: "Report updated",
    });
  } catch (error) {
    console.error("AI report update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
