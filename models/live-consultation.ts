import mongoose, { Document, Model, Types } from "mongoose";

export type LiveConsultationStatus =
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled";

export interface ILiveConsultation extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  triageReportId?: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  status: LiveConsultationStatus;
  reason: string;
  summary?: string;
  doctorNotes?: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LiveConsultationSchema = new mongoose.Schema<ILiveConsultation>(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    triageReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TriageReport",
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
    reason: { type: String, required: true },
    summary: { type: String },
    doctorNotes: { type: String },
    startedAt: { type: Date },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

LiveConsultationSchema.index({ patientId: 1, createdAt: -1 });
LiveConsultationSchema.index({ doctorId: 1, status: 1 });

const LiveConsultation: Model<ILiveConsultation> =
  mongoose.models.LiveConsultation ||
  mongoose.model<ILiveConsultation>("LiveConsultation", LiveConsultationSchema);

export default LiveConsultation;
