import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import {
  requireAuth,
  forbiddenResponse,
} from "@/lib/api-auth";
import {
  toSafeAppointment,
  isValidStatus,
  parseAppointmentDate,
  isWithinBookingWindow,
} from "@/lib/appointments";
import type {
  UpdateAppointmentBody,
  AppointmentErrorResponse,
  AppointmentSuccessResponse,
} from "@/types/appointment";

const populateFields = [
  { path: "patientId", select: "name email" },
  { path: "doctorId", select: "name email" },
];

type RouteContext = { params: Promise<{ id: string }> };

async function findAppointment(id: string) {
  await connectDB();
  return Appointment.findById(id).populate(populateFields);
}

function getRefId(field: unknown): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "_id" in field) {
    return (field as { _id: { toString(): string } })._id.toString();
  }
  return String(field);
}

function canAccess(
  auth: { userId: string; role: string },
  appointment: { patientId: unknown; doctorId: unknown }
): boolean {
  if (auth.role === "admin") return true;
  if (auth.role === "patient" && getRefId(appointment.patientId) === auth.userId)
    return true;
  if (auth.role === "doctor" && getRefId(appointment.doctorId) === auth.userId)
    return true;
  return false;
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const appointment = await findAppointment(id);

    if (!appointment) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (!canAccess(auth, appointment)) {
      return forbiddenResponse("You do not have access to this appointment");
    }

    return NextResponse.json<AppointmentSuccessResponse>({
      success: true,
      appointment: toSafeAppointment(appointment),
    });
  } catch (error) {
    console.error("Appointment GET error:", error);
    return NextResponse.json<AppointmentErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const appointment = await findAppointment(id);

    if (!appointment) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (!canAccess(auth, appointment)) {
      return forbiddenResponse("You do not have access to this appointment");
    }

    const body = (await req.json()) as UpdateAppointmentBody;

    if (auth.role === "patient") {
      if (body.status && body.status !== "cancelled") {
        return forbiddenResponse("Patients can only cancel appointments");
      }
      if (appointment.status !== "pending" && body.status === "cancelled") {
        return NextResponse.json<AppointmentErrorResponse>(
          { success: false, message: "Only pending appointments can be cancelled" },
          { status: 400 }
        );
      }
    }

    if (body.status) {
      if (!isValidStatus(body.status)) {
        return NextResponse.json<AppointmentErrorResponse>(
          {
            success: false,
            message: "Status must be: pending, approved, completed, or cancelled",
          },
          { status: 400 }
        );
      }

      if (auth.role === "doctor") {
        const allowed = ["approved", "completed", "cancelled"];
        if (!allowed.includes(body.status)) {
          return forbiddenResponse("Doctors cannot set this status");
        }
      }

      appointment.status = body.status;
    }

    if (body.date) {
      const newDate = parseAppointmentDate(body.date);
      if (!newDate || !isWithinBookingWindow(newDate)) {
        return NextResponse.json<AppointmentErrorResponse>(
          {
            success: false,
            message: "Date must be between today and 60 days from now",
          },
          { status: 400 }
        );
      }
      appointment.date = newDate;
    }

    if (body.time) appointment.time = body.time.trim();
    if (body.reason) appointment.reason = body.reason.trim();
    if (body.notes !== undefined) appointment.notes = body.notes.trim();

    await appointment.save();

    const updated = await findAppointment(id);

    return NextResponse.json<AppointmentSuccessResponse>({
      success: true,
      appointment: toSafeAppointment(updated!),
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Appointment PATCH error:", error);
    return NextResponse.json<AppointmentErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const appointment = await findAppointment(id);

    if (!appointment) {
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (auth.role === "admin") {
      await Appointment.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: "Appointment deleted",
      });
    }

    if (auth.role === "patient" && getRefId(appointment.patientId) === auth.userId) {
      if (appointment.status === "completed") {
        return NextResponse.json<AppointmentErrorResponse>(
          { success: false, message: "Completed appointments cannot be deleted" },
          { status: 400 }
        );
      }
      appointment.status = "cancelled";
      await appointment.save();
      const updated = await findAppointment(id);
      return NextResponse.json<AppointmentSuccessResponse>({
        success: true,
        appointment: toSafeAppointment(updated!),
        message: "Appointment cancelled",
      });
    }

    return forbiddenResponse("You cannot delete this appointment");
  } catch (error) {
    console.error("Appointment DELETE error:", error);
    return NextResponse.json<AppointmentErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
