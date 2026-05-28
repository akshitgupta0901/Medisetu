import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/transaction";
import Appointment from "@/models/appointment";
import Doctor from "@/models/doctor";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { syncPatientTransactions } from "@/lib/admin-sync";
import { normalizeAppointmentType } from "@/lib/appointments";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "patient") {
      return forbiddenResponse("Only patients can access billing");
    }

    await connectDB();

    // Sync this patient's transactions from appointments
    await syncPatientTransactions(auth.userId);

    const transactions = await Transaction.find({ patientId: auth.userId })
      .sort({ createdAt: -1 })
      .lean();

    if (transactions.length === 0) {
      return NextResponse.json({
        success: true,
        bills: [],
        summary: { totalBilled: 0, totalPaid: 0, totalPending: 0, count: 0 },
      });
    }

    // Gather related IDs
    const doctorIds = [...new Set(transactions.map((t) => String(t.doctorId)))];
    const appointmentIds = transactions.map((t) => t.appointmentId);

    const [doctors, doctorProfiles, appointments] = await Promise.all([
      User.find({ _id: { $in: doctorIds } }).select("name email").lean(),
      Doctor.find({ userId: { $in: doctorIds } })
        .select("userId specialization consultationFee")
        .lean(),
      Appointment.find({ _id: { $in: appointmentIds } })
        .select("appointmentDate appointmentTime appointmentType status department")
        .lean(),
    ]);

    const doctorMap = new Map(doctors.map((d) => [String(d._id), d]));
    const profileMap = new Map(
      doctorProfiles.map((p) => [String(p.userId), p])
    );
    const appointmentMap = new Map(
      appointments.map((a) => [String(a._id), a])
    );

    const bills = transactions.map((t) => {
      const doctor = doctorMap.get(String(t.doctorId));
      const profile = profileMap.get(String(t.doctorId));
      const appointment = appointmentMap.get(String(t.appointmentId));

      return {
        id: String(t._id),
        invoiceNumber: `INV-${String(t._id).slice(-8).toUpperCase()}`,
        appointmentId: String(t.appointmentId),
        doctorName: doctor?.name ?? "Unknown",
        doctorEmail: doctor?.email ?? "",
        specialization: profile?.specialization ?? "General",
        consultationFee: profile?.consultationFee ?? 0,
        appointmentDate: appointment?.appointmentDate
          ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
          : "",
        appointmentTime: appointment?.appointmentTime ?? "",
        appointmentType: normalizeAppointmentType(
          appointment?.appointmentType ?? "Online"
        ),
        appointmentStatus: appointment?.status ?? "",
        department: (appointment as unknown as Record<string, unknown>)?.department ?? "General",
        amount: t.amount,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt
          ? new Date(t.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: t.updatedAt
          ? new Date(t.updatedAt).toISOString()
          : new Date().toISOString(),
      };
    });

    // Compute summary
    let totalPaid = 0;
    let totalPending = 0;
    for (const b of bills) {
      if (b.status === "paid") totalPaid += b.amount;
      if (b.status === "pending") totalPending += b.amount;
    }

    return NextResponse.json({
      success: true,
      bills,
      summary: {
        totalBilled: totalPaid + totalPending,
        totalPaid,
        totalPending,
        count: bills.length,
      },
    });
  } catch (error: unknown) {
    console.error("Patient billing GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load billing data" },
      { status: 500 }
    );
  }
}
