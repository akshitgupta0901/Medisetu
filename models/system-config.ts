import mongoose, { Document, Model } from "mongoose";

export interface ISystemConfig extends Document {
  key: string;
  platformName: string;
  supportEmail: string;
  maxBookingDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  updatedAt: Date;
}

const SystemConfigSchema = new mongoose.Schema<ISystemConfig>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    platformName: { type: String, default: "MediSetu AI" },
    supportEmail: { type: String, default: "support@medisetu.com" },
    maxBookingDays: { type: Number, default: 60 },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const SystemConfig: Model<ISystemConfig> =
  mongoose.models.SystemConfig ||
  mongoose.model<ISystemConfig>("SystemConfig", SystemConfigSchema);

export default SystemConfig;
