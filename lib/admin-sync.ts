import Appointment from "@/models/appointment";
import Consultation from "@/models/consultation";
import Transaction from "@/models/transaction";
import Doctor from "@/models/doctor";
import type { ConsultationStatus } from "@/models/consultation";
import {
  normalizeAppointmentStatus,
  normalizeAppointmentType,
  toSafeAppointment,
} from "@/lib/appointments";
import type { AppointmentStatus } from "@/types/appointment";

function mapAppointmentToConsultationStatus(
  status: AppointmentStatus
): ConsultationStatus {
  switch (status) {
    case "Completed":
      return "completed";
    case "Cancelled":
      return "cancelled";
    case "Scheduled":
    default:
      return "scheduled";
  }
}

function mapAppointmentToTransactionStatus(
  status: AppointmentStatus,
  amount: number
): "paid" | "pending" | "cancelled" {
  if (status === "Cancelled") return "cancelled";
  if (status === "Completed" && amount > 0) return "paid";
  if (status === "Completed") return "pending";
  return "pending";
}

export async function syncConsultationsFromAppointments(): Promise<void> {
  const appointments = await Appointment.find().lean();

  await Promise.all(
    appointments.map((apt) => {
      const safe = toSafeAppointment(apt as Parameters<typeof toSafeAppointment>[0]);
      return Consultation.findOneAndUpdate(
        { appointmentId: apt._id },
        {
          patientId: apt.patientId,
          doctorId: apt.doctorId,
          status: mapAppointmentToConsultationStatus(safe.status),
          type: safe.appointmentType,
          reason: safe.reason,
          notes: safe.notes,
          consultationDate: apt.appointmentDate ?? (apt as { date?: Date }).date,
        },
        { upsert: true, new: true }
      );
    })
  );
}

export async function syncTransactionsFromAppointments(): Promise<void> {
  const appointments = await Appointment.find({
    status: { $in: ["Scheduled", "Completed", "completed", "Cancelled", "cancelled"] },
  } as Record<string, unknown>).lean();

  const doctorIds = [...new Set(appointments.map((a) => String(a.doctorId)))];
  const doctors = await Doctor.find({
    userId: { $in: doctorIds },
  }).lean();
  const feeByDoctor = new Map(
    doctors.map((d) => [String(d.userId), d.consultationFee ?? 0])
  );

  await Promise.all(
    appointments.map((apt) => {
      const status = normalizeAppointmentStatus(apt.status);
      const safe = toSafeAppointment(apt as Parameters<typeof toSafeAppointment>[0]);
      const amount = feeByDoctor.get(String(apt.doctorId)) ?? 0;

      return Transaction.findOneAndUpdate(
        { appointmentId: apt._id },
        {
          patientId: apt.patientId,
          doctorId: apt.doctorId,
          amount,
          status: mapAppointmentToTransactionStatus(status, amount),
          description: `Consultation — ${safe.department} (${normalizeAppointmentType(safe.appointmentType)})`,
        },
        { upsert: true, new: true }
      );
    })
  );
}

export async function syncPatientTransactions(patientId: string): Promise<void> {
  const appointments = await Appointment.find({
    patientId,
    status: { $in: ["Scheduled", "Completed", "completed", "Cancelled", "cancelled"] },
  } as Record<string, unknown>).lean();

  if (appointments.length === 0) return;

  const doctorIds = [...new Set(appointments.map((a) => String(a.doctorId)))];
  const doctors = await Doctor.find({ userId: { $in: doctorIds } }).lean();
  const feeByDoctor = new Map(
    doctors.map((d) => [String(d.userId), d.consultationFee ?? 0])
  );

  await Promise.all(
    appointments.map((apt) => {
      const status = normalizeAppointmentStatus(apt.status);
      const safe = toSafeAppointment(apt as Parameters<typeof toSafeAppointment>[0]);
      const amount = feeByDoctor.get(String(apt.doctorId)) ?? 0;

      return Transaction.findOneAndUpdate(
        { appointmentId: apt._id },
        {
          patientId: apt.patientId,
          doctorId: apt.doctorId,
          amount,
          status: mapAppointmentToTransactionStatus(status, amount),
          description: `Consultation — ${safe.department} (${normalizeAppointmentType(safe.appointmentType)})`,
        },
        { upsert: true, new: true }
      );
    })
  );
}
