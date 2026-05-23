import mongoose, { Document, Model, Types } from "mongoose";

export type CallSessionStatus = "active" | "ended";

export interface ICallSession extends Document {
  consultationId: Types.ObjectId;
  startedBy: Types.ObjectId;
  status: CallSessionStatus;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;
  createdAt: Date;
}

const CallSessionSchema = new mongoose.Schema<ICallSession>(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveConsultation",
      required: true,
    },
    startedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

CallSessionSchema.index({ consultationId: 1, createdAt: -1 });

const CallSession: Model<ICallSession> =
  mongoose.models.CallSession ||
  mongoose.model<ICallSession>("CallSession", CallSessionSchema);

export default CallSession;
