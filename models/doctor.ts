import mongoose, { Document, Model, Types } from "mongoose";

export interface IDoctor extends Document {
  userId: Types.ObjectId;
  specialization: string;
  qualification: string;
  hospital: string;
  experience: number;
  consultationFee: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  bio?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new mongoose.Schema<IDoctor>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: { type: String, required: true },
    qualification: { type: String, default: "" },
    hospital: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    availability: {
      days: { type: [String], default: [] },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "17:00" },
    },
    bio: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

DoctorSchema.index({ userId: 1 });

const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);

export default Doctor;
