import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TriageReport from "@/models/triage-report";
import Appointment from "@/models/appointment";
import Doctor from "@/models/doctor";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import {
  toSafeAppointment,
  parseAppointmentDate,
  isWithinBookingWindow,
  normalizeAppointmentStatus,
  mapBookingTypeToAppointmentType,
} from "@/lib/appointments";
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
    const dateStr = body.appointmentDate ?? body.date;
    const appointmentTime = String(body.appointmentTime ?? body.time ?? "").trim();
    const appointmentType = mapBookingTypeToAppointmentType(
      body.appointmentType ?? body.type ?? "Online"
    );
    const notes =
      body.notes?.trim() ||
      `Follow-up: ${String(body.reason ?? "").slice(0, 120)}`;

    if (!dateStr || !appointmentTime) {
      return NextResponse.json(
        { success: false, message: "Date and time are required" },
        { status: 400 }
      );
    }

    const appointmentDate = parseAppointmentDate(dateStr);
    if (!appointmentDate || !isWithinBookingWindow(appointmentDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "Date must be between today and 60 days from now",
        },
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

    const doctorId = String(report.doctorId);
    const doctorProfile = await Doctor.findOne({
      userId: doctorId,
      verificationStatus: "Approved",
    });
    if (!doctorProfile) {
      return NextResponse.json(
        { success: false, message: "Doctor is not verified" },
        { status: 403 }
      );
    }

    const { Types } = await import("mongoose");
    const existingAppointment = await Appointment.findOne({
      doctorId: new Types.ObjectId(doctorId),
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lte: new Date(appointmentDate).setHours(23, 59, 59, 999),
      },
      appointmentTime,
      status: { $ne: "Cancelled" },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: "This time slot is already booked" },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      patientId: report.patientId,
      doctorId: report.doctorId,
      triageReportId: report._id,
      appointmentDate,
      appointmentTime,
      appointmentType,
      status: normalizeAppointmentStatus("Scheduled"),
      notes: notes || report.doctorNotes,
    });

    report.appointmentId = appointment._id;
    report.status = "Completed";
    await report.save();

    await createNotification({
      userId: String(report.patientId),
      title: "Appointment recommended",
      message:
        "Your doctor scheduled a follow-up appointment from your triage report.",
      type: "appointment",
      link: "/patient/appointments",
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
