"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/triage", active: true },
  { label: "AI Triage", href: "/ai-triage", active: false },
  { label: "Clinical History", href: "#", active: false },
  { label: "Patient Insights", href: "#", active: false },
  { label: "Settings", href: "#", active: false },
];

function CrossIcon() {
  return (
    <span className="relative h-5 w-5" aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-cyan-200" />
      <span className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-cyan-200" />
    </span>
  );
}

function NavMark({ active }: { active: boolean }) {
  return (
    <span
      className={`h-2 w-2 rounded-full transition ${
        active ? "bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.6)]" : "bg-slate-600"
      }`}
      aria-hidden="true"
    />
  );
}

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] flex-col border-r border-white/10 bg-[#07111d] p-5 lg:flex"
    >
      <Link
        href="/"
        aria-label="MediSetu home"
        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.06]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
          <CrossIcon />
        </span>

        <span>
          <span className="block text-lg font-semibold tracking-tight text-white">
            MediSetu
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/55">
            AI Triage
          </span>
        </span>
      </Link>

      <nav aria-label="Triage workspace" className="mt-8 space-y-2">
        {navItems.map((item, index) => (
          <motion.a
            key={item.label}
            href={"href" in item ? item.href : "#"}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-medium transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 ${
              item.active
                ? "border-cyan-200/20 bg-cyan-200/[0.08] text-white shadow-lg shadow-cyan-950/20"
                : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.045] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <NavMark active={item.active} />
              {item.label}
            </span>
            <span
              className={`h-px w-5 bg-gradient-to-r from-transparent to-cyan-200 transition duration-300 ${
                item.active ? "opacity-80" : "opacity-0 group-hover:opacity-40"
              }`}
              aria-hidden="true"
            />
          </motion.a>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-cyan-200/10 bg-cyan-200/[0.045] p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/60">
            AI Load
          </p>
          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Stable
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "72%" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-teal-300"
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          18 active cases routed through clinical review.
        </p>
      </div>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 text-sm font-semibold text-cyan-100"
          >
            SM
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">
              Dr. Sarah Miller
            </h3>
            <p className="mt-1 text-xs text-slate-400">Senior Clinician</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
