import mongoose, { Document, Model, Types } from "mongoose";

export type ConsultationStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface IConsultation extends Document {
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  status: ConsultationStatus;
  type: "in-person" | "telehealth";
  reason: string;
  notes?: string;
  consultationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new mongoose.Schema<IConsultation>(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
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
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["in-person", "telehealth"],
      default: "telehealth",
    },
    reason: { type: String, required: true },
    notes: { type: String },
    consultationDate: { type: Date, required: true },
  },
  { timestamps: true }
);

ConsultationSchema.index({ patientId: 1, consultationDate: -1 });
ConsultationSchema.index({ doctorId: 1, consultationDate: -1 });
ConsultationSchema.index({ status: 1 });

const Consultation: Model<IConsultation> =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>("Consultation", ConsultationSchema);

export default Consultation;
