import mongoose, { Document, Model, Types } from "mongoose";

export interface IMessage extends Document {
  consultationId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "patient" | "doctor" | "admin";
  content: string;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveConsultation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    content: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MessageSchema.index({ consultationId: 1, createdAt: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
