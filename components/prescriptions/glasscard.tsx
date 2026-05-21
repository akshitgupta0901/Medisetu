import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        bg-slate-900/70
        backdrop-blur-xl
        border
        border-slate-800
        rounded-2xl
        shadow-lg
        shadow-black/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}