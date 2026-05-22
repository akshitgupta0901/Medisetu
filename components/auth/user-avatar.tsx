"use client";

import { getUserInitials } from "@/lib/user-display";
import type { SafeUser } from "@/types/auth";

interface UserAvatarProps {
  user: SafeUser;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-24 w-24 text-2xl",
};

export default function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name}
        className={`rounded-full object-cover border border-teal-500/30 ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 ${sizeClass} ${className}`}
      aria-hidden
    >
      {getUserInitials(user.name)}
    </div>
  );
}
