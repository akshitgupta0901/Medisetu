import type { UserRole } from "@/types/auth";

export function getRoleDashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    admin: "/admin",
    doctor: "/doctor",
    patient: "/patient",
  };
  return paths[role];
}
