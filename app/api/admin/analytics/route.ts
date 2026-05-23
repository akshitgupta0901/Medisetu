import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Appointment from "@/models/appointment";
import Prescription from "@/models/prescription";
import { requireAdmin } from "@/lib/admin-auth";
import type { AdminAnalyticsResponse, AdminErrorResponse } from "@/types/admin";

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalPrescriptions,
    ] = await Promise.all([
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "pending" }),
      Prescription.countDocuments(),
    ]);

    return NextResponse.json<AdminAnalyticsResponse>({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalPrescriptions,
      },
    });
  } catch (error) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
