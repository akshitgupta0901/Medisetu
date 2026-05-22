"use client";

import { useAuth } from "@/contexts/auth-context";
import UserAvatar from "./user-avatar";
import { getRoleSubtitle } from "@/lib/user-display";

interface SidebarUserCardProps {
  variant?: "slate" | "green";
}

export default function SidebarUserCard({ variant = "slate" }: SidebarUserCardProps) {
  const { user } = useAuth();

  if (!user) return null;

  const isGreen = variant === "green";

  return (
    <div className={`flex items-center gap-3 ${isGreen ? "p-0" : ""}`}>
      <UserAvatar user={user} size="sm" />
      <div className="min-w-0">
        <p
          className={`font-semibold truncate ${
            isGreen ? "text-white" : "text-white"
          }`}
        >
          {user.name}
        </p>
        <p
          className={`text-xs truncate ${
            isGreen ? "text-[#c5c6cd]" : "text-slate-400"
          }`}
        >
          {getRoleSubtitle(user)}
        </p>
      </div>
    </div>
  );
}
