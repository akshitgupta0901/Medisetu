import type { TriageAnalysis, SeverityLevel } from "@/types/ai-triage";

export type TriageReportStatus =
  | "Pending"
  | "Assigned"
  | "Under Review"
  | "Escalated"
  | "Completed";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface TriageReportRow {
  id: string;
  patientId: string;
  patientName?: string;
  patientEmail?: string;
  doctorId?: string;
  doctorName?: string;
  symptoms: string;
  severity: SeverityLevel;
  riskLevel: RiskLevel;
  triageScore: number;
  recommendations: string[];
  analysis: TriageAnalysis;
  status: TriageReportStatus;
  doctorNotes?: string;
  age?: number;
  duration?: string;
  appointmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TriageAnalytics {
  totalReports: number;
  highSeverityReports: number;
  pendingReview: number;
  averageSeverityScore: number;
  completedToday: number;
}

export interface TriageListResponse {
  success: true;
  reports: TriageReportRow[];
  count: number;
}

export interface TriageAnalyticsResponse {
  success: true;
  analytics: TriageAnalytics;
}
