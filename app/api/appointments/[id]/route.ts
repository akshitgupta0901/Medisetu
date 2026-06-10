import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import Doctor from "@/models/doctor";
import {
  requireAuth,
  forbiddenResponse,
} from "@/lib/api-auth";
import {
  toSafeAppointment,
  isValidStatus,
  parseAppointmentDate,
  isWithinBookingWindow,
  getObjectIdString,
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

function canAccess(
  auth: { userId: string; role: string },
  appointment: { patientId: unknown; doctorId: unknown }
): boolean {
  if (auth.role === "admin") return true;
  if (auth.role === "patient" && getObjectIdString(appointment.patientId) === auth.userId)
    return true;
  if (auth.role === "doctor" && getObjectIdString(appointment.doctorId) === auth.userId)
    return true;
  return false;
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    console.log("DEBUG APPOINTMENT ID GET: AUTH INFO", { userId: auth instanceof NextResponse ? 'N/A' : auth.userId, role: auth instanceof NextResponse ? 'N/A' : auth.role });
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    console.log("DEBUG APPOINTMENT ID GET: TARGET ID", id);
    
    const appointment = await findAppointment(id);

    if (!appointment) {
      console.log("DEBUG APPOINTMENT ID GET: NOT FOUND");
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (!canAccess(auth, appointment)) {
      console.log("DEBUG APPOINTMENT ID GET: ACCESS DENIED");
      return forbiddenResponse("You do not have access to this appointment");
    }

    const doctorIdStr = getObjectIdString(appointment.doctorId);
    const doctorProfile = await Doctor.findOne({ userId: doctorIdStr, verificationStatus: "Approved" });
    console.log("DEBUG APPOINTMENT ID GET: DOCTOR VERIFIED?", !!doctorProfile);

    const responseData = {
      success: true,
      appointment: {
        ...toSafeAppointment(appointment),
        doctorVerified: !!doctorProfile
      },
    };
    
    console.log("DEBUG APPOINTMENT ID GET: RETURNING SUCCESS");
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("DEBUG APPOINTMENT ID GET CRASH:", {
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

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    console.log("DEBUG APPOINTMENT ID PATCH: AUTH INFO", { userId: auth instanceof NextResponse ? 'N/A' : auth.userId, role: auth instanceof NextResponse ? 'N/A' : auth.role });
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    console.log("DEBUG APPOINTMENT ID PATCH: TARGET ID", id);
    
    const appointment = await findAppointment(id);

    if (!appointment) {
      console.log("DEBUG APPOINTMENT ID PATCH: NOT FOUND");
      return NextResponse.json<AppointmentErrorResponse>(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (!canAccess(auth, appointment)) {
      console.log("DEBUG APPOINTMENT ID PATCH: ACCESS DENIED");
      return forbiddenResponse("You do not have access to this appointment");
    }

    const body = (await req.json()) as UpdateAppointmentBody;
    console.log("DEBUG APPOINTMENT ID PATCH: REQUEST BODY", body);

    if (body.status) {
      if (!isValidStatus(body.status)) {
        return NextResponse.json<AppointmentErrorResponse>(
          {
            success: false,
            message: "Status must be: Scheduled, Completed, or Cancelled",
          },
          { status: 400 }
        );
      }

      // Role-based status authorization
      if (auth.role === "patient") {
        if (body.status !== "Cancelled") {
          return forbiddenResponse("Patients can only cancel appointments");
        }
      }

      if (auth.role === "doctor") {
        if (body.status === "Scheduled") {
          return forbiddenResponse("Doctors cannot set an appointment back to Scheduled");
        }
      }

      appointment.status = body.status;
    }

    if (body.appointmentDate || body.appointmentTime) {
      const checkDate = body.appointmentDate ? parseAppointmentDate(body.appointmentDate) : appointment.appointmentDate;
      const checkTime = body.appointmentTime || appointment.appointmentTime;
      
      if (checkDate) {
        const existing = await Appointment.findOne({
          _id: { $ne: id },
          doctorId: appointment.doctorId,
          appointmentDate: {
            $gte: new Date(checkDate).setHours(0, 0, 0, 0),
            $lte: new Date(checkDate).setHours(23, 59, 59, 999)
          },
          appointmentTime: checkTime,
          status: { $ne: "Cancelled" }
        });
        
        if (existing) {
          console.log("DEBUG APPOINTMENT ID PATCH: SLOT BOOKED ALREADY");
          return NextResponse.json({ success: false, message: "This time slot is already booked" }, { status: 409 });
        }
      }
    }

    if (body.appointmentDate) {
      const newDate = parseAppointmentDate(body.appointmentDate);
      if (!newDate || !isWithinBookingWindow(newDate)) {
        return NextResponse.json<AppointmentErrorResponse>(
          {
            success: false,
            message: "Date must be between today and 60 days from now",
          },
          { status: 400 }
        );
      }
      appointment.appointmentDate = newDate;
    }

    if (body.appointmentTime) appointment.appointmentTime = body.appointmentTime.trim();
    if (body.notes !== undefined) appointment.notes = body.notes.trim();

    console.log("DEBUG APPOINTMENT ID PATCH: SAVING CHANGES", {
      appointmentId: id,
      triageReportId: appointment.triageReportId,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      newStatus: appointment.status,
    });
    // validateModifiedOnly: true prevents ValidationError on legacy appointments
    // that are missing fields added after their creation (e.g. triageReportId).
    // Mongoose by default validates ALL required fields on save(), not just changed ones.
    await appointment.save({ validateModifiedOnly: true });

    const updated = await findAppointment(id);
    const updatedDoctorIdStr = getObjectIdString(updated!.doctorId);
    const doctorProfile = await Doctor.findOne({ userId: updatedDoctorIdStr, verificationStatus: "Approved" });
    console.log("DEBUG APPOINTMENT ID PATCH: DOCTOR VERIFIED?", !!doctorProfile);

    // Create notifications for status changes
    if (body.status) {
      const { createNotification } = await import("@/lib/notifications");
      const patientId = getObjectIdString(appointment.patientId);
      const doctorId = getObjectIdString(appointment.doctorId);
      
      if (body.status === "Cancelled") {
        const targetUserId = auth.role === "patient" ? doctorId : patientId;
        const msg = auth.role === "patient" 
          ? "A patient has cancelled their appointment."
          : "Your appointment has been cancelled";
        
        await createNotification({
          userId: targetUserId,
          title: "Appointment Cancelled",
          message: msg,
          type: "appointment",
          link: auth.role === "patient" ? `/doctor/appointments` : `/patient/appointments`,
        });
      } else if (body.status === "Completed") {
        await createNotification({
          userId: patientId,
          title: "Appointment Completed",
          message: "Your appointment has been marked as completed",
          type: "appointment",
          link: `/patient/appointments`,
        });
      }
    }

    const responseData = {
      success: true,
      appointment: {
        ...toSafeAppointment(updated!),
        doctorVerified: !!doctorProfile
      },
      message: "Appointment updated successfully",
    };
    
    console.log("DEBUG APPOINTMENT ID PATCH: RETURNING SUCCESS");
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("DEBUG APPOINTMENT ID PATCH CRASH:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      errors: error.errors, // Mongoose ValidationError details
    });
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      // Always expose the real error so Vercel logs and client can diagnose
      error: error.message,
      errorName: error.name,
      validationErrors: error.errors
        ? Object.entries(error.errors).map(([k, v]: [string, any]) => ({ field: k, message: v.message }))
        : undefined,
    }, { status: 500 });
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

    return forbiddenResponse("You cannot delete this appointment");
  } catch (error: any) {
    console.error("Appointment DELETE error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
