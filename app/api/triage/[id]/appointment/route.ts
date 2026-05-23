import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TriageReport from "@/models/triage-report";
import Appointment from "@/models/appointment";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { toSafeAppointment } from "@/lib/appointments";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors can create appointments from triage");
    }

    const { id } = await params;
    const body = await req.json();
    const { date, time, department } = body;

    if (!date || !time) {
      return NextResponse.json(
        { success: false, message: "Date and time are required" },
        { status: 400 }
      );
    }

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

    if (!report.doctorId) {
      return NextResponse.json(
        { success: false, message: "No doctor assigned to this report" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create({
      patientId: report.patientId,
      doctorId: report.doctorId,
      date: new Date(date),
      time: String(time),
      reason: `Follow-up: ${report.symptoms.slice(0, 120)}`,
      department: department || report.analysis.recommendedSpecialist || "General",
      type: "telehealth",
      status: "pending",
      notes: report.doctorNotes,
    });

    report.appointmentId = appointment._id;
    report.status = "Completed";
    await report.save();

    await createNotification({
      userId: String(report.patientId),
      title: "Appointment recommended",
      message: "Your doctor scheduled a follow-up appointment from your triage report.",
      type: "appointment",
      link: "/patient",
    });

    const populated = await Appointment.findById(appointment._id).populate([
      { path: "patientId", select: "name email" },
      { path: "doctorId", select: "name email" },
    ]);

    return NextResponse.json({
      success: true,
      appointment: toSafeAppointment(populated!),
      message: "Appointment created from triage report",
    });
  } catch (error) {
    console.error("Triage appointment error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
