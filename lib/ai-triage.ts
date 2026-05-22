import type { TriageAnalysis, SeverityLevel } from "@/types/ai-triage";

const VALID_SEVERITIES: SeverityLevel[] = [
  "low",
  "moderate",
  "high",
  "critical",
];

export function parseTriageResponse(raw: string): TriageAnalysis | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    const severity = String(parsed.severityLevel ?? "moderate").toLowerCase();
    const severityLevel = VALID_SEVERITIES.includes(severity as SeverityLevel)
      ? (severity as SeverityLevel)
      : "moderate";

    const urgencyScore = Math.min(
      100,
      Math.max(0, Number(parsed.urgencyScore) || 50)
    );

    const conditions = Array.isArray(parsed.possibleConditions)
      ? parsed.possibleConditions.map((c: Record<string, unknown>) => ({
          name: String(c.name ?? "Unknown"),
          likelihood: String(c.likelihood ?? "Possible"),
          description: c.description ? String(c.description) : undefined,
        }))
      : [];

    return {
      possibleConditions: conditions.slice(0, 5),
      severityLevel,
      recommendedSpecialist: String(
        parsed.recommendedSpecialist ?? "General Practitioner"
      ),
      urgencyScore,
      summary: String(parsed.summary ?? "Analysis complete."),
      careAdvice: String(
        parsed.careAdvice ??
          "Consult a healthcare professional for proper diagnosis."
      ),
      disclaimer: String(
        parsed.disclaimer ??
          "This is not a medical diagnosis. Seek emergency care if symptoms are severe."
      ),
    };
  } catch {
    return null;
  }
}

export function buildTriagePrompt(
  symptoms: string,
  age?: number,
  duration?: string
): string {
  const context = [
    age ? `Patient age: ${age}` : null,
    duration ? `Symptom duration: ${duration}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `Analyze the following patient symptoms for a preliminary triage assessment.

${context ? `${context}\n` : ""}Symptoms reported:
${symptoms}

Respond ONLY with valid JSON in this exact shape (no markdown):
{
  "possibleConditions": [
    { "name": "condition name", "likelihood": "high|moderate|low", "description": "brief explanation" }
  ],
  "severityLevel": "low|moderate|high|critical",
  "recommendedSpecialist": "specialist type e.g. Cardiologist",
  "urgencyScore": 0-100,
  "summary": "2-3 sentence clinical summary",
  "careAdvice": "recommended next steps",
  "disclaimer": "standard non-diagnostic disclaimer"
}

Rules:
- List 2-5 possible conditions ranked by likelihood
- urgencyScore: 0=not urgent, 100=emergency
- severityLevel must reflect clinical urgency
- Be conservative; recommend emergency care for chest pain, stroke signs, severe bleeding, etc.`;
}
