import mongoose, { Document, Model, Types } from "mongoose";

export interface IVitalSign extends Document {
  patientId: Types.ObjectId;
  heartRate: number;
  bloodOxygen: number;
  glucose: number;
  createdAt: Date;
  updatedAt: Date;
}

const VitalSignSchema = new mongoose.Schema<IVitalSign>(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    heartRate: { type: Number, required: true },
    bloodOxygen: { type: Number, required: true },
    glucose: { type: Number, required: true },
  },
  { timestamps: true }
);

VitalSignSchema.index({ patientId: 1 });

const VitalSign: Model<IVitalSign> =
  mongoose.models.VitalSign ||
  mongoose.model<IVitalSign>("VitalSign", VitalSignSchema);

export default VitalSign;
