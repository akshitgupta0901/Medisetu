import mongoose, { Document, Model, Types } from "mongoose";
import type { TriageAnalysis } from "@/types/ai-triage";
import type { RiskLevel, TriageReportStatus } from "@/types/triage";

export interface ITriageReport extends Document {
  patientId: Types.ObjectId;
  doctorId?: Types.ObjectId;
  symptoms: string;
  severity: string;
  riskLevel: RiskLevel;
  triageScore: number;
  recommendations: string[];
  analysis: TriageAnalysis;
  status: TriageReportStatus;
  doctorNotes?: string;
  age?: number;
  duration?: string;
  appointmentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TriageReportSchema = new mongoose.Schema<ITriageReport>(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    symptoms: { type: String, required: true },
    severity: { type: String, required: true },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    triageScore: { type: Number, required: true },
    recommendations: { type: [String], default: [] },
    analysis: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Under Review", "Escalated", "Completed"],
      default: "Pending",
    },
    doctorNotes: { type: String },
    age: { type: Number },
    duration: { type: String },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true }
);

TriageReportSchema.index({ patientId: 1, createdAt: -1 });
TriageReportSchema.index({ doctorId: 1, status: 1, createdAt: -1 });
TriageReportSchema.index({ status: 1, severity: 1 });

const TriageReport: Model<ITriageReport> =
  mongoose.models.TriageReport ||
  mongoose.model<ITriageReport>("TriageReport", TriageReportSchema);

export default TriageReport;
