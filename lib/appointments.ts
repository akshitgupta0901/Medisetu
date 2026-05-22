import type { SafeAppointment, AppointmentUserRef } from "@/types/appointment";
import type { IAppointment } from "@/models/appointment";

function isPopulatedUser(field: unknown): field is { _id: { toString(): string }; name: string; email: string } {
  return (
    typeof field === "object" &&
    field !== null &&
    "name" in field &&
    "email" in field &&
    "_id" in field
  );
}

function toUserRef(field: unknown): AppointmentUserRef | undefined {
  if (!isPopulatedUser(field)) return undefined;
  return {
    _id: field._id.toString(),
    name: field.name,
    email: field.email,
  };
}

function getObjectIdString(field: unknown): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "_id" in field) {
    return (field as { _id: { toString(): string } })._id.toString();
  }
  return String(field);
}

export function toSafeAppointment(doc: IAppointment): SafeAppointment {
  const patientRef = toUserRef(doc.patientId as unknown);
  const doctorRef = toUserRef(doc.doctorId as unknown);

  return {
    _id: doc._id.toString(),
    patientId: getObjectIdString(doc.patientId),
    doctorId: getObjectIdString(doc.doctorId),
    patient: patientRef,
    doctor: doctorRef,
    date: new Date(doc.date).toISOString().split("T")[0],
    time: doc.time,
    reason: doc.reason,
    department: doc.department,
    type: doc.type,
    status: doc.status,
    notes: doc.notes,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export const VALID_STATUSES = [
  "pending",
  "approved",
  "completed",
  "cancelled",
] as const;

export function isValidStatus(status: string): boolean {
  return VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number]);
}

export function parseAppointmentDate(dateStr: string): Date | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date;
}

export const MAX_APPOINTMENT_DAYS_AHEAD = 60;

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export function getMaxAppointmentDate(): Date {
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setDate(max.getDate() + MAX_APPOINTMENT_DAYS_AHEAD);
  return max;
}

export function isWithinBookingWindow(date: Date): boolean {
  if (!isFutureDate(date)) return false;
  const max = getMaxAppointmentDate();
  return date <= max;
}

export function getMinBookingDateString(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split("T")[0];
}

export function getMaxBookingDateString(): string {
  return getMaxAppointmentDate().toISOString().split("T")[0];
}
