import type { VerificationStatus } from "@/models/doctor";

export type DoctorProfileInput = {
  specialization?: string;
  qualification?: string;
  hospital?: string;
  experience?: number;
  consultationFee?: number;
  phone?: string;
  bio?: string;
};

export function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** MediSetu v1.0 — profile complete when all required fields + ≥1 availability slot. */
export function calculateDoctorProfileCompletion(
  profile: DoctorProfileInput | null | undefined,
  weeklySlotCount: number
): number {
  if (!profile) return 0;

  const checks = [
    isNonEmptyString(profile.specialization),
    isNonEmptyString(profile.qualification),
    isNonEmptyString(profile.hospital),
    typeof profile.experience === "number" && profile.experience >= 0,
    typeof profile.consultationFee === "number" && profile.consultationFee > 0,
    isNonEmptyString(profile.phone),
    isNonEmptyString(profile.bio),
    weeklySlotCount >= 1,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function isProfileCompleteForVerification(
  profile: DoctorProfileInput | null | undefined,
  weeklySlotCount: number
): boolean {
  return calculateDoctorProfileCompletion(profile, weeklySlotCount) === 100;
}

export function getVerificationStatusLabel(status: VerificationStatus | string): string {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Pending":
      return "Pending";
    case "Approved":
      return "Approved";
    case "Rejected":
      return "Rejected";
    default:
      return String(status);
  }
}

export function canSubmitForVerification(
  status: VerificationStatus | string,
  completion: number
): boolean {
  return completion === 100 && (status === "Draft" || status === "Rejected");
}
