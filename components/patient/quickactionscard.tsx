"use client";

import Link from "next/link";
import {
  CalendarPlus,
  ClipboardList,
  FileText,
  Video,
  type LucideIcon,
} from "lucide-react";
import GlassCard from "./glasscard";

const actions: {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
}[] = [
  {
    label: "Book Appointment",
    href: "/patient/appointments",
    icon: CalendarPlus,
    primary: true,
  },
  { label: "Check Symptoms", href: "/patient/triage", icon: ClipboardList },
  { label: "View Prescriptions", href: "/patient/prescriptions", icon: FileText },
  { label: "Start Consultation", href: "/telehealth", icon: Video },
];

export default function QuickActionsCard() {
  return (
    <GlassCard className="h-full p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
            Quick Actions
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Care shortcuts
          </h2>
        </div>
        <CalendarPlus className="text-teal-300" size={22} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map(({ label, href, icon: Icon, primary }) => (
          <Link
            key={label}
            href={href}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${
              primary
                ? "bg-teal-300 text-slate-950 shadow-lg shadow-teal-500/15 hover:bg-teal-200 focus:ring-teal-200"
                : "border border-slate-700 bg-slate-950/70 text-slate-100 hover:border-teal-400/50 hover:text-teal-200 focus:ring-teal-300"
            }`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}
