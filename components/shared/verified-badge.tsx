import { ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export default function VerifiedBadge({ className = "", size = "md" }: VerifiedBadgeProps) {
  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-[11px]";
  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full shadow-lg shadow-teal-500/5 ${sizeClasses} ${className}`}>
      <ShieldCheck size={iconSize} />
      <span>Verified</span>
    </span>
  );
}
