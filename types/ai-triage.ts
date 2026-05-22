export type SeverityLevel = "low" | "moderate" | "high" | "critical";

export interface PossibleCondition {
  name: string;
  likelihood: string;
  description?: string;
}

export interface TriageAnalysis {
  possibleConditions: PossibleCondition[];
  severityLevel: SeverityLevel;
  recommendedSpecialist: string;
  urgencyScore: number;
  summary: string;
  careAdvice: string;
  disclaimer: string;
}

export interface TriageRequestBody {
  symptoms: string;
  age?: number;
  duration?: string;
}

export interface TriageSuccessResponse {
  success: true;
  analysis: TriageAnalysis;
}

export interface TriageErrorResponse {
  success: false;
  message: string;
}
