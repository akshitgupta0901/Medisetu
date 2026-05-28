import mongoose, { Document, Model, Types } from "mongoose";
import type { AppointmentStatus, AppointmentType } from "@/types/appointment";

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  triageReportId: Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new mongoose.Schema<IAppointment>(
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
      required: true,
    },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    appointmentType: {
      type: String,
      enum: ["Online", "In-Person"],
      default: "Online",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ patientId: 1, appointmentDate: -1 });
AppointmentSchema.index({ doctorId: 1, appointmentDate: -1 });
AppointmentSchema.index({ status: 1 });

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
