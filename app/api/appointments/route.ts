import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import {
  requireAuth,
  forbiddenResponse,
} from "@/lib/api-auth";
import {
  toSafeAppointment,
  parseAppointmentDate,
  isWithinBookingWindow,
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
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    let query: Record<string, unknown> = {};

    if (auth.role === "patient") {
      query = { patientId: auth.userId };
    } else if (auth.role === "doctor") {
      query = { doctorId: auth.userId };
    } else if (auth.role === "admin") {
      query = {};
    } else {
      return forbiddenResponse();
    }

    if (statusFilter) {
      query.status = statusFilter;
    }

    const appointments = await Appointment.find(query)
      .populate(populateFields)
      .sort({ date: 1, time: 1 });

    return NextResponse.json<AppointmentsListResponse>({
      success: true,
      appointments: appointments.map(toSafeAppointment),
      count: appointments.length,
    });
  } catch (error) {
    console.error("Appointments GET error:", error);
    return NextResponse.json<AppointmentErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "patient") {
      return forbiddenResponse("Only patients can book appointments");
    }

    const body = (await req.json()) as CreateAppointmentBody;
    const { doctorId, date, time, reason, department, type } = body;

    if (!doctorId || !date || !time || !reason?.trim()) {
      return NextResponse.json<AppointmentErrorResponse>(
        {
          success: false,
          message: "Doctor, date, time, and reason are required",
        },
        { status: 400 }
      );
    }

    const appointmentDate = parseAppointmentDate(date);
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
          message:
            "Appointment must be between today and 60 days from now",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Selected doctor not found" },
        { status: 404 }
      );
    }

    const appointment = await Appointment.create({
      patientId: auth.userId,
      doctorId,
      date: appointmentDate,
      time: time.trim(),
      reason: reason.trim(),
      department: department?.trim() || "General",
      type: type || "telehealth",
      status: "pending",
    });

    const populated = await Appointment.findById(appointment._id).populate(
      populateFields
    );

    return NextResponse.json<AppointmentSuccessResponse>(
      {
        success: true,
        appointment: toSafeAppointment(populated!),
        message: "Appointment booked successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointments POST error:", error);
    return NextResponse.json<AppointmentErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
