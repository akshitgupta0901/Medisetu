import mongoose, { Document, Model, Types } from "mongoose";

export interface ILabResult extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  reportName: string;
  reportDate: Date;
  pdfUrl: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabResultSchema = new mongoose.Schema<ILabResult>(
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
    reportName: { type: String, required: true },
    reportDate: { type: Date, default: Date.now },
    pdfUrl: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

LabResultSchema.index({ patientId: 1, reportDate: -1 });

const LabResult: Model<ILabResult> =
  mongoose.models.LabResult || mongoose.model<ILabResult>("LabResult", LabResultSchema);

export default LabResult;
