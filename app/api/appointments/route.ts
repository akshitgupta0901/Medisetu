import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import Doctor from "@/models/doctor";
import {
  requireAuth,
  forbiddenResponse,
} from "@/lib/api-auth";
import TriageReport from "@/models/triage-report";
import {
  toSafeAppointment,
  parseAppointmentDate,
  isWithinBookingWindow,
  getObjectIdString,
  expandStatusFilter,
  mapBookingTypeToAppointmentType,
  normalizeAppointmentStatus,
} from "@/lib/appointments";
import type {
  CreateAppointmentBody,
  AppointmentErrorResponse,
  AppointmentsListResponse,
  AppointmentSuccessResponse,
} from "@/types/appointment";

const populateFields = [
  { path: "patientId", select: "name email" },
  { path: "doctorId", select: "name email" },
];

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    console.log("DEBUG APPOINTMENTS GET: AUTH INFO", { userId: auth instanceof NextResponse ? 'N/A' : auth.userId, role: auth instanceof NextResponse ? 'N/A' : auth.role });
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const doctorIdFilter = searchParams.get("doctorId");
    const dateFilter = searchParams.get("date");
    console.log("DEBUG APPOINTMENTS GET: FILTERS", { statusFilter, doctorIdFilter, dateFilter });

    let query: Record<string, unknown> = {};

    if (auth.role === "patient") {
      query = { patientId: auth.userId };
    } else if (auth.role === "doctor") {
      query = { doctorId: auth.userId };
    } else if (auth.role === "admin") {
      query = {};
    } else {
      console.log("DEBUG APPOINTMENTS GET: FORBIDDEN ROLE", auth.role);
      return forbiddenResponse();
    }

    if (statusFilter && statusFilter !== "all") {
      const expanded = expandStatusFilter(statusFilter);
      if (expanded) query.status = expanded;
    }

    if (doctorIdFilter) {
      query.doctorId = doctorIdFilter;
    }

    if (dateFilter) {
      const startOfDay = new Date(dateFilter);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateFilter);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }
    
    console.log("DEBUG APPOINTMENTS GET: MONGODB QUERY", query);

    const appointments = await Appointment.find(query)
      .populate(populateFields)
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    console.log("DEBUG APPOINTMENTS GET: FOUND COUNT", appointments.length);

    // Fetch verification status for doctors
    // Use getObjectIdString to handle both populated and unpopulated doctorId
    const doctorUserIds = [...new Set(appointments.map(a => getObjectIdString(a.doctorId)))];
    console.log("DEBUG APPOINTMENTS GET: DOCTOR IDS FOR VERIFICATION", doctorUserIds);
    
    const verifiedProfiles = await Doctor.find({ 
      userId: { $in: doctorUserIds }, 
      verificationStatus: "Approved" 
    }).select("userId");
    console.log("DEBUG APPOINTMENTS GET: VERIFIED PROFILES FOUND", verifiedProfiles.length);
    
    const verifiedDoctorSet = new Set(verifiedProfiles.map(p => String(p.userId)));

    const responseData = {
      success: true,
      appointments: appointments.map(appt => ({
        ...toSafeAppointment(appt),
        doctorVerified: verifiedDoctorSet.has(getObjectIdString(appt.doctorId))
      })),
      count: appointments.length,
    };
    
    console.log("DEBUG APPOINTMENTS GET: RETURNING SUCCESS");
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("DEBUG APPOINTMENTS GET CRASH:", {
      message: error.message,
      stack: error.stack,
      error
    });
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

async function ensureTriageReportId(
  patientId: string,
  doctorId: string,
  reason: string,
  department: string
): Promise<string> {
  const report = await TriageReport.create({
    patientId,
    doctorId,
    symptoms: reason.slice(0, 500) || "Appointment request",
    severity: "moderate",
    riskLevel: "Low",
    triageScore: 50,
    recommendations: [],
    analysis: {
      possibleConditions: [],
      severityLevel: "low",
      recommendedSpecialist: department || "General",
      urgencyScore: 3,
      summary: reason || "Patient-initiated appointment request",
      careAdvice: "Await clinical review",
      disclaimer: "Not a medical diagnosis",
    },
    status: "Pending",
  });
  return report._id.toString();
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = (await req.json()) as CreateAppointmentBody;
    console.log("CREATE APPOINTMENT REQUEST BODY:", body);

    const doctorId = body.doctorId;
    const dateStr = body.appointmentDate ?? body.date;
    const appointmentTime = (body.appointmentTime ?? body.time ?? "").trim();
    const appointmentType = mapBookingTypeToAppointmentType(
      body.appointmentType ?? body.type
    );
    const notes = (body.notes ?? body.reason ?? "").trim();
    const department = body.department?.trim() || "General";

    let patientId = body.patientId;
    let triageReportId = body.triageReportId;

    if (auth.role === "patient") {
      patientId = auth.userId;
    }

    if (!patientId || !doctorId || !dateStr || !appointmentTime) {
      return NextResponse.json<AppointmentErrorResponse>(
        {
          success: false,
          message: "Doctor, date, and time are required",
        },
        { status: 400 }
      );
    }

    const { Types } = await import("mongoose");
    if (!Types.ObjectId.isValid(patientId) || !Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json<AppointmentErrorResponse>(
        {
          success: false,
          message: "Invalid ID format for patient or doctor",
        },
        { status: 400 }
      );
    }

    if (triageReportId && !Types.ObjectId.isValid(triageReportId)) {
      return NextResponse.json<AppointmentErrorResponse>(
        {
          success: false,
          message: "Invalid triage report ID",
        },
        { status: 400 }
      );
    }

    const appointmentDate = parseAppointmentDate(dateStr);
    if (!appointmentDate) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Invalid date format" },
        { status: 400 }
      );
    }

    if (!isWithinBookingWindow(appointmentDate)) {
      return NextResponse.json<AppointmentErrorResponse>(
        {
          success: false,
          message: "Appointment must be between today and 60 days from now",
        },
        { status: 400 }
      );
    }

    await connectDB();

    if (!triageReportId) {
      triageReportId = await ensureTriageReportId(
        patientId,
        doctorId,
        notes,
        department
      );
    }

    const [patient, doctor] = await Promise.all([
      User.findById(patientId),
      User.findById(doctorId),
    ]);

    if (!patient || !doctor) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Patient or Doctor not found in database" },
        { status: 404 }
      );
    }

    if (auth.role === "patient" && patientId !== auth.userId) {
      return forbiddenResponse("Patients can only book for themselves");
    }

    if (auth.role === "doctor" && patientId === auth.userId) {
      return forbiddenResponse("Doctors cannot book appointments as patients");
    }

    const doctorProfile = await Doctor.findOne({ userId: doctorId });
    if (!doctorProfile || doctorProfile.verificationStatus !== "Approved") {
      return NextResponse.json<AppointmentErrorResponse>(
        {
          success: false,
          message: "Doctor is not verified and cannot receive appointments",
        },
        { status: 403 }
      );
    }

    // Check for double booking
    const existingAppointment = await Appointment.findOne({
      doctorId: new Types.ObjectId(doctorId),
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lte: new Date(appointmentDate).setHours(23, 59, 59, 999)
      },
      appointmentTime: appointmentTime.trim(),
      status: { $ne: "Cancelled" }
    });

    if (existingAppointment) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "This time slot is already booked" },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(doctorId),
      triageReportId: new Types.ObjectId(triageReportId),
      appointmentDate,
      appointmentTime,
      appointmentType,
      status: normalizeAppointmentStatus("Scheduled"),
      notes: notes || undefined,
    });

    const populated = await Appointment.findById(appointment._id).populate(
      populateFields
    );

    try {
      const { createNotification } = await import("@/lib/notifications");
      const formattedDate = new Date(appointmentDate).toLocaleDateString();
      if (auth.role === "patient") {
        await createNotification({
          userId: doctorId,
          title: "New Appointment Request",
          message: `${patient.name} booked an appointment on ${formattedDate} at ${appointmentTime}.`,
          type: "appointment",
          link: `/doctor/appointments`,
        });
        await createNotification({
          userId: patientId,
          title: "Appointment Scheduled",
          message: `Your visit with Dr. ${doctor.name} is scheduled for ${formattedDate} at ${appointmentTime}.`,
          type: "appointment",
          link: `/patient/appointments`,
        });
      } else {
        await createNotification({
          userId: patientId,
          title: "Appointment Scheduled",
          message: `Dr. ${doctor.name} scheduled an appointment on ${formattedDate} at ${appointmentTime}.`,
          type: "appointment",
          link: `/patient/appointments`,
        });
      }
    } catch (notifError) {
      console.error("Non-critical notification error:", notifError);
    }

    return NextResponse.json<AppointmentSuccessResponse>(
      {
        success: true,
        appointment: toSafeAppointment(populated!),
        message: "Appointment scheduled successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Appointments POST error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
