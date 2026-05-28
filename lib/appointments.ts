import type {
  SafeAppointment,
  AppointmentUserRef,
  AppointmentStatus,
  AppointmentType,
} from "@/types/appointment";
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

export function getObjectIdString(field: unknown): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof (field as { _id?: { toString(): string } })?._id === "object") {
    return (field as { _id: { toString(): string } })._id.toString();
  }
  return String(field);
}

const LEGACY_STATUS_MAP: Record<string, AppointmentStatus> = {
  pending: "Scheduled",
  approved: "Scheduled",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function normalizeAppointmentStatus(raw: unknown): AppointmentStatus {
  const value = String(raw ?? "Scheduled").trim();
  if (value === "Scheduled" || value === "Completed" || value === "Cancelled") {
    return value;
  }
  return LEGACY_STATUS_MAP[value.toLowerCase()] ?? "Scheduled";
}

export function normalizeAppointmentType(raw: unknown): AppointmentType {
  const value = String(raw ?? "Online").toLowerCase();
  if (value === "in-person" || value === "in person" || value === "inperson") {
    return "In-Person";
  }
  if (value === "online" || value === "telehealth") {
    return "Online";
  }
  if (raw === "In-Person" || raw === "Online") {
    return raw;
  }
  return "Online";
}

/** Expand legacy status query params to match both old and new DB values. */
export function expandStatusFilter(
  statusFilter: string
): string | { $in: string[] } | undefined {
  if (!statusFilter || statusFilter === "all") return undefined;

  const normalized = statusFilter.toLowerCase();
  switch (normalized) {
    case "scheduled":
    case "pending":
    case "approved":
      return { $in: ["Scheduled", "pending", "approved"] };
    case "completed":
      return { $in: ["Completed", "completed"] };
    case "cancelled":
      return { $in: ["Cancelled", "cancelled"] };
    default:
      return statusFilter;
  }
}

export function isUpcomingAppointmentStatus(status: AppointmentStatus | string): boolean {
  const normalized = normalizeAppointmentStatus(status);
  return normalized === "Scheduled";
}

export function formatAppointmentTypeLabel(type: string | undefined): string {
  if (!type) return "Online";
  return type.replace(/-/g, " ");
}

export function toSafeAppointment(doc: IAppointment | Record<string, unknown>): SafeAppointment {
  const raw = doc as IAppointment & Record<string, unknown>;

  const patientRef = toUserRef(raw.patientId as unknown);
  const doctorRef = toUserRef(raw.doctorId as unknown);

  let rawDate: unknown = raw.appointmentDate;
  if (!rawDate && typeof raw.get === "function") rawDate = raw.get("date");
  if (!rawDate) rawDate = raw.date ?? (raw as Record<string, unknown>).date;

  let safeDate = "";
  if (rawDate) {
    const d = new Date(rawDate as string | Date);
    if (!isNaN(d.getTime())) {
      safeDate = d.toISOString().split("T")[0];
    }
  }

  let safeTime = raw.appointmentTime;
  if (!safeTime && typeof raw.get === "function") safeTime = raw.get("time");
  if (!safeTime) safeTime = String(raw.time ?? "");

  let safeType = normalizeAppointmentType(
    raw.appointmentType ?? raw.type ?? "Online"
  );

  const safeStatus = normalizeAppointmentStatus(raw.status);
  const safeReason = String(
    raw.notes ?? raw.reason ?? ""
  ).trim();

  const id = getObjectIdString(raw._id);

  return {
    id,
    _id: id,
    patientId: getObjectIdString(raw.patientId),
    doctorId: getObjectIdString(raw.doctorId),
    triageReportId: raw.triageReportId
      ? getObjectIdString(raw.triageReportId)
      : undefined,
    patient: patientRef,
    doctor: doctorRef,
    appointmentDate: safeDate,
    appointmentTime: safeTime,
    appointmentType: safeType,
    date: safeDate,
    time: safeTime,
    type: safeType,
    reason: safeReason,
    department: String(raw.department ?? "General"),
    status: safeStatus,
    notes: raw.notes ? String(raw.notes) : safeReason || undefined,
    createdAt:
      raw.createdAt instanceof Date
        ? raw.createdAt.toISOString()
        : raw.createdAt
          ? String(raw.createdAt)
          : undefined,
    updatedAt:
      raw.updatedAt instanceof Date
        ? raw.updatedAt.toISOString()
        : raw.updatedAt
          ? String(raw.updatedAt)
          : undefined,
  };
}

export const VALID_STATUSES = [
  "Scheduled",
  "Completed",
  "Cancelled",
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

/** Map UI / legacy appointment type values to canonical enum. */
export function mapBookingTypeToAppointmentType(
  type?: string
): AppointmentType {
  return normalizeAppointmentType(type ?? "telehealth");
}
