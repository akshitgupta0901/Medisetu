import mongoose, { Document, Model, Types } from "mongoose";

export type TransactionStatus = "paid" | "pending" | "cancelled";

export interface ITransaction extends Document {
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
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
    amount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["paid", "pending", "cancelled"],
      default: "pending",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

TransactionSchema.index({ patientId: 1, createdAt: -1 });
TransactionSchema.index({ doctorId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
