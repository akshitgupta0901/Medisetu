"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const summaryItems = [
  { label: "Vitals", value: "Stable", tone: "text-teal-400" },
  { label: "Risk", value: "Low", tone: "text-cyan-400" },
  { label: "Trend", value: "+4%", tone: "text-blue-400" },
];

export default function HealthSummary() {
  return (
    <motion.section
      className="md:col-span-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Health summary"
    >
      <GlassCard className="relative overflow-hidden p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/60 to-transparent" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
              Health summary
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f8fafc]">
              Everything looks stable
            </h2>
          </div>

          <span className="rounded-full border border-[#5eead4]/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-[#99f6e4]">
            82%
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full">
            <div className="absolute inset-0 rounded-full border-[10px] border-[#1e3a46]" />
            <div className="absolute inset-0 rounded-full border-[10px] border-[#5eead4] border-b-[#1e3a46]" />
            <div className="relative text-center">
              <p className="text-2xl font-semibold text-[#ccfbf1]">82</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                Score
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#f8fafc]">
              Stable baseline
            </p>
            <p className="mt-1 text-sm leading-5 text-[#cbd5e1]">
              No immediate concerns detected.
            </p>
          </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94a3b8]">
                {item.label}
              </p>
              <p className={`mt-1 text-sm font-semibold ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[#67e8f9]/15 bg-cyan-400/[0.045] p-4">
          <p className="text-sm leading-5 text-[#cbd5e1]">
            Vitals have remained consistent across the last 24 hours.
          </p>
        </div>
      </GlassCard>
    </motion.section>
  );
}
