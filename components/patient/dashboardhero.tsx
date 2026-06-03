"use client";

import Link from "next/link";
import { CalendarPlus, Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getFirstName } from "@/lib/user-display";

export default function DashboardHero() {
  const { user } = useAuth();
  const firstName = user ? getFirstName(user.name) : "there";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-400/20 bg-slate-950 px-5 py-6 shadow-2xl shadow-cyan-950/20 md:px-8 md:py-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/70 to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
            Patient Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Good to see you, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Book your next consultation or check symptoms from the first screen.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[430px]">
          <Link
            href="/patient/appointments"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-teal-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <CalendarPlus size={18} />
            Book Appointment
          </Link>
          <Link
            href="/patient/triage"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/15 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <Stethoscope size={18} />
            Check Symptoms
          </Link>
        </div>
      </div>
    </section>
  );
}
