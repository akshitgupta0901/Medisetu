import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TriageReport from "@/models/triage-report";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import {
  toTriageReportRow,
  notifyTriageEscalated,
} from "@/lib/triage-workflow";
import type { TriageReportStatus } from "@/types/triage";

async function canAccessReport(
  auth: { userId: string; role: string },
  report: { patientId: unknown; doctorId?: unknown }
): Promise<boolean> {
  if (auth.role === "admin") return true;
  if (auth.role === "patient" && String(report.patientId) === auth.userId)
    return true;
  if (
    auth.role === "doctor" &&
    report.doctorId &&
    String(report.doctorId) === auth.userId
  )
    return true;
  return false;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();

    const report = await TriageReport.findById(id).lean();
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    if (!(await canAccessReport(auth, report))) {
      return forbiddenResponse();
    }

    const [patient, doctor] = await Promise.all([
      User.findById(report.patientId).select("name email").lean(),
      report.doctorId
        ? User.findById(report.doctorId).select("name").lean()
        : null,
    ]);

    return NextResponse.json({
      success: true,
      report: toTriageReportRow(report, patient ?? undefined, doctor ?? undefined),
    });
  } catch (error) {
    console.error("Triage GET by id error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load report" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors can update triage reports");
    }

    const { id } = await params;
    const body = await req.json();
    const { status, doctorNotes, escalate } = body;

    await connectDB();
    const report = await TriageReport.findById(id);
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    if (auth.role === "doctor" && String(report.doctorId) !== auth.userId) {
      return forbiddenResponse();
    }

    if (status) {
      const valid: TriageReportStatus[] = [
        "Pending",
        "Assigned",
        "Under Review",
        "Escalated",
        "Completed",
      ];
      if (valid.includes(status)) {
        report.status = status;
      }
    }

    if (doctorNotes !== undefined) report.doctorNotes = String(doctorNotes);
    if (escalate) {
      report.status = "Escalated";
      if (report.doctorId) {
        await notifyTriageEscalated(String(report.doctorId), id);
      }
    }

    if (report.status === "Assigned" && auth.role === "doctor") {
      report.status = "Under Review";
    }

    await report.save();

    const patient = await User.findById(report.patientId).select("name email").lean();
    const doctor = report.doctorId
      ? await User.findById(report.doctorId).select("name").lean()
      : null;

    return NextResponse.json({
      success: true,
      report: toTriageReportRow(report.toObject(), patient ?? undefined, doctor ?? undefined),
    });
  } catch (error) {
    console.error("Triage PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update report" },
      { status: 500 }
    );
  }
}
