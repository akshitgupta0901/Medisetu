import type {
  SafePatientRecord,
  BloodGroup,
  HistoryStatus,
  MedicalHistoryEntry,
  MedicationEntry,
  EmergencyContact,
} from "@/types/patient-record";
import type { IPatientRecord } from "@/models/Patient";

const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

export function isValidBloodGroup(value: string): value is BloodGroup {
  return BLOOD_GROUPS.includes(value as BloodGroup);
}

function isPopulatedUser(
  field: unknown
): field is { _id: { toString(): string }; name: string; email: string } {
  return (
    typeof field === "object" &&
    field !== null &&
    "name" in field &&
    "email" in field
  );
}

function getUserIdString(field: unknown): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "_id" in field) {
    return (field as { _id: { toString(): string } })._id.toString();
  }
  return String(field);
}

function formatDate(d?: Date | string): string | undefined {
  if (!d) return undefined;
  return new Date(d).toISOString().split("T")[0];
}

export function toSafePatientRecord(doc: IPatientRecord): SafePatientRecord {
  const userField = doc.userId as unknown;

  return {
    _id: doc._id.toString(),
    userId: getUserIdString(doc.userId),
    user: isPopulatedUser(userField)
      ? {
          _id: userField._id.toString(),
          name: userField.name,
          email: userField.email,
        }
      : undefined,
    bloodGroup: doc.bloodGroup,
    allergies: doc.allergies ?? [],
    medicalHistory: (doc.medicalHistory ?? []).map((h) => ({
      condition: h.condition,
      diagnosedDate: formatDate(h.diagnosedDate),
      status: h.status,
      notes: h.notes,
    })),
    medications: (doc.medications ?? []).map((m) => ({
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      startDate: formatDate(m.startDate),
      endDate: formatDate(m.endDate),
      prescribedBy: m.prescribedBy,
    })),
    emergencyContact: {
      name: doc.emergencyContact?.name ?? "",
      relationship: doc.emergencyContact?.relationship ?? "",
      phone: doc.emergencyContact?.phone ?? "",
      email: doc.emergencyContact?.email,
    },
    doctorNotes: (doc.doctorNotes ?? []).map((n) => ({
      _id: (n as { _id?: { toString(): string } })._id?.toString(),
      doctorId: n.doctorId.toString(),
      doctorName: n.doctorName,
      note: n.note,
      createdAt: n.createdAt?.toISOString(),
    })),
    dateOfBirth: formatDate(doc.dateOfBirth),
    gender: doc.gender,
    phone: doc.phone,
    address: doc.address,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export function validateEmergencyContact(
  contact?: EmergencyContact
): string | null {
  if (!contact) return null;
  if (contact.phone && !/^[\d\s+\-()]{7,20}$/.test(contact.phone)) {
    return "Invalid emergency contact phone number";
  }
  return null;
}

export function validateMedicalHistory(
  entries?: MedicalHistoryEntry[]
): string | null {
  if (!entries) return null;
  for (const e of entries) {
    if (!e.condition?.trim()) return "Medical history condition is required";
  }
  return null;
}

export function mapMedicalHistoryForDb(
  entries?: MedicalHistoryEntry[]
): { condition: string; diagnosedDate?: Date; status: HistoryStatus; notes?: string }[] {
  if (!entries) return [];
  return entries.map((e) => ({
    condition: e.condition.trim(),
    diagnosedDate: e.diagnosedDate ? new Date(e.diagnosedDate) : undefined,
    status: e.status,
    notes: e.notes,
  }));
}

export function mapMedicationsForDb(
  entries?: MedicationEntry[]
): {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: Date;
  endDate?: Date;
  prescribedBy?: string;
}[] {
  if (!entries) return [];
  return entries.map((m) => ({
    name: m.name.trim(),
    dosage: m.dosage.trim(),
    frequency: m.frequency.trim(),
    startDate: m.startDate ? new Date(m.startDate) : undefined,
    endDate: m.endDate ? new Date(m.endDate) : undefined,
    prescribedBy: m.prescribedBy,
  }));
}

export function validateMedications(entries?: MedicationEntry[]): string | null {
  if (!entries) return null;
  for (const m of entries) {
    if (!m.name?.trim() || !m.dosage?.trim() || !m.frequency?.trim()) {
      return "Medication name, dosage, and frequency are required";
    }
  }
  return null;
}
