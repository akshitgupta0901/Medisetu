import type { SafeUser, UserRole } from "@/types/auth";

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "there";
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  if (first.toLowerCase().startsWith("dr.") && parts.length > 1) {
    return parts[1];
  }
  return first.replace(/^dr\.?$/i, "") || trimmed;
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "System Administrator",
    doctor: "Physician",
    patient: "Patient",
  };
  return labels[role];
}

export function getRoleSubtitle(user: SafeUser): string {
  if (user.role === "doctor") {
    return user.specialization || "Physician";
  }
  return getRoleLabel(user.role);
}

export function getWelcomeMessage(user: SafeUser): string {
  const first = getFirstName(user.name);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (user.role === "doctor") {
    return `Welcome back, ${first}`;
  }
  if (user.role === "admin") {
    return `Welcome back, ${first}`;
  }
  return `${greeting}, ${first}`;
}

export function getShortId(userId: string): string {
  return userId.slice(-8).toUpperCase();
}
