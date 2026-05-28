import mongoose, { Document, Model, Types } from "mongoose";

export interface IDoctorAvailability extends Document {
  doctorId: Types.ObjectId;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorAvailabilitySchema = new mongoose.Schema<IDoctorAvailability>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure a doctor doesn't have overlapping slots for the same day (can be handled in logic or complex index)
// For simplicity, we'll index by doctor and day
DoctorAvailabilitySchema.index({ doctorId: 1, dayOfWeek: 1 });

const DoctorAvailability: Model<IDoctorAvailability> =
  mongoose.models.DoctorAvailability ||
  mongoose.model<IDoctorAvailability>("DoctorAvailability", DoctorAvailabilitySchema);

export default DoctorAvailability;
