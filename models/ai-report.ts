import mongoose, { Document, Model, Types } from "mongoose";

export interface IAiReport extends Document {
  patientId: Types.ObjectId;
  symptoms: string;
  analysis: {
    possibleConditions: {
      name: string;
      likelihood: string;
      description?: string;
    }[];
    severityLevel: string;
    recommendedSpecialist: string;
    urgencyScore: number;
    summary: string;
    careAdvice: string;
    disclaimer: string;
  };
  age?: number;
  duration?: string;
  reviewedBy?: Types.ObjectId; // Doctor who reviewed this
  createdAt: Date;
  updatedAt: Date;
}

const AiReportSchema = new mongoose.Schema<IAiReport>(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: { type: String, required: true },
    analysis: {
      possibleConditions: [
        {
          name: String,
          likelihood: String,
          description: String,
        },
      ],
      severityLevel: { type: String, required: true },
      recommendedSpecialist: { type: String, required: true },
      urgencyScore: { type: Number, required: true },
      summary: { type: String, required: true },
      careAdvice: { type: String, required: true },
      disclaimer: { type: String, required: true },
    },
    age: Number,
    duration: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

AiReportSchema.index({ patientId: 1, createdAt: -1 });

const AiReport: Model<IAiReport> =
  mongoose.models.AiReport || mongoose.model<IAiReport>("AiReport", AiReportSchema);

export default AiReport;
