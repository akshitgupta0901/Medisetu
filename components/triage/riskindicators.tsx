"use client";

import { motion } from "framer-motion";

const risks = [
  { label: "Hypertension", level: "High", value: "88%", color: "bg-red-300", text: "text-red-100" },
  { label: "Age (65+)", level: "Moderate", value: "64%", color: "bg-amber-300", text: "text-amber-100" },
  { label: "Physical Activity", level: "Low", value: "31%", color: "bg-cyan-300", text: "text-cyan-100" },
];

export default function RiskIndicators() {
  return (
    <motion.section
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
        Risk model
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
        Risk Indicators
      </h2>

      <div className="mt-6 space-y-4">
        {risks.map((risk, index) => (
          <motion.div
            key={risk.label}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.24 + index * 0.06 }}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-white">{risk.label}</span>
              <span className={`text-sm font-semibold ${risk.text}`}>
                {risk.level}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${risk.color}`}
                  style={{ width: risk.value }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-slate-400">
                {risk.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
