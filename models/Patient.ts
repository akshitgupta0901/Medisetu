import mongoose, { Document, Model, Types } from "mongoose";
import type { BloodGroup, HistoryStatus } from "@/types/patient-record";

export interface IMedicalHistory {
  condition: string;
  diagnosedDate?: Date;
  status: HistoryStatus;
  notes?: string;
}

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: Date;
  endDate?: Date;
  prescribedBy?: string;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface IDoctorNote {
  doctorId: Types.ObjectId;
  doctorName?: string;
  note: string;
  createdAt: Date;
}

export interface IPatientRecord extends Document {
  userId: Types.ObjectId;
  bloodGroup: BloodGroup;
  allergies: string[];
  medicalHistory: IMedicalHistory[];
  medications: IMedication[];
  emergencyContact: IEmergencyContact;
  doctorNotes: IDoctorNote[];
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalHistorySchema = new mongoose.Schema<IMedicalHistory>(
  {
    condition: { type: String, required: true },
    diagnosedDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "resolved", "chronic"],
      default: "active",
    },
    notes: { type: String },
  },
  { _id: true }
);

const MedicationSchema = new mongoose.Schema<IMedication>(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    prescribedBy: { type: String },
  },
  { _id: true }
);

const EmergencyContactSchema = new mongoose.Schema<IEmergencyContact>(
  {
    name: { type: String, default: "" },
    relationship: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String },
  },
  { _id: false }
);

const DoctorNoteSchema = new mongoose.Schema<IDoctorNote>(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String },
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const PatientRecordSchema = new mongoose.Schema<IPatientRecord>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },
    allergies: { type: [String], default: [] },
    medicalHistory: { type: [MedicalHistorySchema], default: [] },
    medications: { type: [MedicationSchema], default: [] },
    emergencyContact: {
      type: EmergencyContactSchema,
      default: () => ({}),
    },
    doctorNotes: { type: [DoctorNoteSchema], default: [] },
    dateOfBirth: { type: Date },
    gender: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

PatientRecordSchema.index({ userId: 1 });

const Patient: Model<IPatientRecord> =
  mongoose.models.Patient ||
  mongoose.model<IPatientRecord>("Patient", PatientRecordSchema);

export default Patient;
