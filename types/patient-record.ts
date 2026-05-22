export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown";

export type HistoryStatus = "active" | "resolved" | "chronic";

export interface MedicalHistoryEntry {
  condition: string;
  diagnosedDate?: string;
  status: HistoryStatus;
  notes?: string;
}

export interface MedicationEntry {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface DoctorNoteEntry {
  _id?: string;
  doctorId: string;
  doctorName?: string;
  note: string;
  createdAt?: string;
}

export interface SafePatientRecord {
  _id: string;
  userId: string;
  user?: { _id: string; name: string; email: string };
  bloodGroup: BloodGroup;
  allergies: string[];
  medicalHistory: MedicalHistoryEntry[];
  medications: MedicationEntry[];
  emergencyContact: EmergencyContact;
  doctorNotes: DoctorNoteEntry[];
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientRecordBody {
  userId?: string;
  bloodGroup?: BloodGroup;
  allergies?: string[];
  medicalHistory?: MedicalHistoryEntry[];
  medications?: MedicationEntry[];
  emergencyContact?: EmergencyContact;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
}

export interface UpdatePatientRecordBody extends CreatePatientRecordBody {
  doctorNote?: string;
}

export interface PatientRecordListResponse {
  success: true;
  records: SafePatientRecord[];
  count: number;
}

export interface PatientRecordResponse {
  success: true;
  record: SafePatientRecord;
  message?: string;
}

export interface PatientRecordErrorResponse {
  success: false;
  message: string;
}
