import TriageReport from "@/models/triage-report";
import User from "@/models/user";
import Doctor from "@/models/doctor";
import type { TriageAnalysis, SeverityLevel } from "@/types/ai-triage";
import type { RiskLevel, TriageReportStatus } from "@/types/triage";
import { createNotification } from "@/lib/notifications";

export function severityToRiskLevel(severity: SeverityLevel): RiskLevel {
  switch (severity) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "moderate":
      return "Medium";
    default:
      return "Low";
  }
}

export function buildRecommendations(analysis: TriageAnalysis): string[] {
  const items: string[] = [analysis.careAdvice];
  analysis.possibleConditions.slice(0, 3).forEach((c) => {
    items.push(`Consider evaluation for ${c.name} (${c.likelihood} likelihood)`);
  });
  items.push(`Recommended specialist: ${analysis.recommendedSpecialist}`);
  return items.filter(Boolean);
}

export async function assignDoctorForTriage(
  recommendedSpecialist: string,
  severity: SeverityLevel
): Promise<string | null> {
  const specialtyRegex = new RegExp(
    recommendedSpecialist.split(/\s+/)[0] || "General",
    "i"
  );

  const doctorProfiles = await Doctor.find({
    $or: [
      { specialization: specialtyRegex },
      { specialization: /general/i },
    ],
  })
    .limit(5)
    .lean();

  if (doctorProfiles.length > 0) {
    const pick =
      severity === "critical" || severity === "high"
        ? doctorProfiles[0]
        : doctorProfiles[Math.floor(Math.random() * doctorProfiles.length)];
    return String(pick.userId);
  }

  const fallback = await User.findOne({ role: "doctor", isSuspended: { $ne: true } })
    .select("_id")
    .lean();
  return fallback ? String(fallback._id) : null;
}

export function initialStatus(severity: SeverityLevel): TriageReportStatus {
  if (severity === "critical" || severity === "high") return "Escalated";
  return "Pending";
}

export async function notifyTriageSubmitted(
  patientId: string,
  reportId: string
): Promise<void> {
  await createNotification({
    userId: patientId,
    title: "Triage report submitted",
    message: "Your AI triage assessment has been recorded. A doctor will review it shortly.",
    type: "triage",
    link: `/patient/triage`,
  });
}

export async function notifyDoctorAssigned(
  doctorId: string,
  patientName: string,
  reportId: string
): Promise<void> {
  await createNotification({
    userId: doctorId,
    title: "New triage assignment",
    message: `${patientName} submitted a triage report requiring your review.`,
    type: "triage",
    link: `/doctor/ai-reports`,
  });
}

export async function notifyTriageEscalated(
  doctorId: string,
  reportId: string
): Promise<void> {
  await createNotification({
    userId: doctorId,
    title: "Triage escalated",
    message: "A high-severity triage report needs immediate attention.",
    type: "triage",
    link: `/doctor/ai-reports`,
  });
}

export function toTriageReportRow(
  doc: {
    _id: unknown;
    patientId: unknown;
    doctorId?: unknown;
    symptoms: string;
    severity: string;
    riskLevel: RiskLevel;
    triageScore: number;
    recommendations: string[];
    analysis: TriageAnalysis;
    status: TriageReportStatus;
    doctorNotes?: string;
    age?: number;
    duration?: string;
    appointmentId?: unknown;
    createdAt?: Date;
    updatedAt?: Date;
  },
  patient?: { name: string; email: string },
  doctor?: { name: string }
) {
  return {
    id: String(doc._id),
    patientId: String(doc.patientId),
    patientName: patient?.name,
    patientEmail: patient?.email,
    doctorId: doc.doctorId ? String(doc.doctorId) : undefined,
    doctorName: doctor?.name,
    symptoms: doc.symptoms,
    severity: doc.severity as SeverityLevel,
    riskLevel: doc.riskLevel,
    triageScore: doc.triageScore,
    recommendations: doc.recommendations,
    analysis: doc.analysis,
    status: doc.status,
    doctorNotes: doc.doctorNotes,
    age: doc.age,
    duration: doc.duration,
    appointmentId: doc.appointmentId ? String(doc.appointmentId) : undefined,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}
