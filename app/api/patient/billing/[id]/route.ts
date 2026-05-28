import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/transaction";
import Appointment from "@/models/appointment";
import Doctor from "@/models/doctor";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { normalizeAppointmentType } from "@/lib/appointments";
import { Types } from "mongoose";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "patient") {
      return forbiddenResponse("Only patients can access billing");
    }

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid bill ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const transaction = await Transaction.findById(id).lean();

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Bill not found" },
        { status: 404 }
      );
    }

    if (String(transaction.patientId) !== auth.userId) {
      return forbiddenResponse("You do not have access to this bill");
    }

    const [doctor, doctorProfile, appointment] = await Promise.all([
      User.findById(transaction.doctorId).select("name email").lean(),
      Doctor.findOne({ userId: transaction.doctorId })
        .select("specialization consultationFee hospital")
        .lean(),
      Appointment.findById(transaction.appointmentId)
        .select("appointmentDate appointmentTime appointmentType status department notes")
        .lean(),
    ]);

    const bill = {
      id: String(transaction._id),
      invoiceNumber: `INV-${String(transaction._id).slice(-8).toUpperCase()}`,
      appointmentId: String(transaction.appointmentId),
      doctorName: doctor?.name ?? "Unknown",
      doctorEmail: doctor?.email ?? "",
      specialization: doctorProfile?.specialization ?? "General",
      hospital: doctorProfile?.hospital ?? "",
      consultationFee: doctorProfile?.consultationFee ?? 0,
      appointmentDate: appointment?.appointmentDate
        ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
        : "",
      appointmentTime: appointment?.appointmentTime ?? "",
      appointmentType: normalizeAppointmentType(
        appointment?.appointmentType ?? "Online"
      ),
      appointmentStatus: appointment?.status ?? "",
      department: (appointment as unknown as Record<string, unknown>)?.department ?? "General",
      notes: appointment?.notes ?? "",
      amount: transaction.amount,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt
        ? new Date(transaction.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: transaction.updatedAt
        ? new Date(transaction.updatedAt).toISOString()
        : new Date().toISOString(),
    };

    return NextResponse.json({ success: true, bill });
  } catch (error: unknown) {
    console.error("Patient billing detail GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load bill details" },
      { status: 500 }
    );
  }
}
