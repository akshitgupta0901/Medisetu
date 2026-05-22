"use client";

import { useRequireAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/types/auth";

export default function AuthGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { user, loading } = useRequireAuth(role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-teal-500/30 border-t-teal-400" />
          <p className="mt-4 text-slate-400 text-sm">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
