import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Doctor from "@/models/doctor";
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
      pendingVerifications,
      approvedDoctors,
      rejectedDoctors,
      draftDoctors,
    ] = await Promise.all([
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "Completed" }),
      Appointment.countDocuments({ status: "Scheduled" }),
      Prescription.countDocuments(),
      Doctor.countDocuments({ verificationStatus: "Pending" }),
      Doctor.countDocuments({ verificationStatus: "Approved" }),
      Doctor.countDocuments({ verificationStatus: "Rejected" }),
      Doctor.countDocuments({ verificationStatus: "Draft" }),
    ]);

    return NextResponse.json<any>({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalPrescriptions,
        verification: {
          pending: pendingVerifications,
          approved: approvedDoctors,
          rejected: rejectedDoctors,
          draft: draftDoctors,
        }
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
