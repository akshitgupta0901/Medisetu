import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import Prescription from "@/models/prescription";
import Patient from "@/models/Patient";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }

    await connectDB();

    const doctorId = auth.userId;

    // Total Patients (Unique patients with appointments with this doctor)
    const uniquePatients = await Appointment.distinct("patientId", { doctorId });
    const totalPatients = uniquePatients.length;

    // Appointment counts
    const completedAppointments = await Appointment.countDocuments({ doctorId, status: "completed" });
    const pendingAppointments = await Appointment.countDocuments({ doctorId, status: "pending" });
    const approvedAppointments = await Appointment.countDocuments({ doctorId, status: "approved" });

    // Prescriptions issued
    const totalPrescriptions = await Prescription.countDocuments({ doctorId });

    // Monthly consultation trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await Appointment.aggregate([
      {
        $match: {
          doctorId: new (await import("mongoose")).Types.ObjectId(doctorId),
          date: { $gte: sixMonthsAgo },
          status: "completed"
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrends = trends.map(t => ({
      month: `${monthNames[t._id.month - 1]} ${t._id.year}`,
      consultations: t.count
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalPatients,
        completedAppointments,
        pendingAppointments,
        approvedAppointments,
        totalPrescriptions,
        trends: formattedTrends
      }
    });
  } catch (error) {
    console.error("Doctor analytics error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
