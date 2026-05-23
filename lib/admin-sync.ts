import Appointment from "@/models/appointment";
import Consultation from "@/models/consultation";
import Transaction from "@/models/transaction";
import Doctor from "@/models/doctor";
import type { ConsultationStatus } from "@/models/consultation";
import type { AppointmentStatus } from "@/types/appointment";

function mapAppointmentToConsultationStatus(
  status: AppointmentStatus
): ConsultationStatus {
  switch (status) {
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    case "approved":
      return "in-progress";
    default:
      return "scheduled";
  }
}

function mapAppointmentToTransactionStatus(
  status: AppointmentStatus,
  amount: number
): "paid" | "pending" | "cancelled" {
  if (status === "cancelled") return "cancelled";
  if (status === "completed" && amount > 0) return "paid";
  if (status === "completed") return "pending";
  return "pending";
}

export async function syncConsultationsFromAppointments(): Promise<void> {
  const appointments = await Appointment.find().lean();

  await Promise.all(
    appointments.map((apt) =>
      Consultation.findOneAndUpdate(
        { appointmentId: apt._id },
        {
          patientId: apt.patientId,
          doctorId: apt.doctorId,
          status: mapAppointmentToConsultationStatus(apt.status),
          type: apt.type,
          reason: apt.reason,
          notes: apt.notes,
          consultationDate: apt.date,
        },
        { upsert: true, new: true }
      )
    )
  );
}

export async function syncTransactionsFromAppointments(): Promise<void> {
  const appointments = await Appointment.find({
    status: { $in: ["completed", "cancelled"] },
  }).lean();

  const doctorIds = [...new Set(appointments.map((a) => String(a.doctorId)))];
  const doctors = await Doctor.find({
    userId: { $in: doctorIds },
  }).lean();
  const feeByDoctor = new Map(
    doctors.map((d) => [String(d.userId), d.consultationFee ?? 0])
  );

  await Promise.all(
    appointments.map((apt) => {
      const amount =
        apt.status === "completed"
          ? feeByDoctor.get(String(apt.doctorId)) ?? 0
          : 0;

      return Transaction.findOneAndUpdate(
        { appointmentId: apt._id },
        {
          patientId: apt.patientId,
          doctorId: apt.doctorId,
          amount,
          status: mapAppointmentToTransactionStatus(apt.status, amount),
          description: `Consultation — ${apt.department} (${apt.type})`,
        },
        { upsert: true, new: true }
      );
    })
  );
}
