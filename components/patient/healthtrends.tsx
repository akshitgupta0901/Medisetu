"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const trends = [
  { label: "Sleep Score", value: "85", trend: "+3%", color: "text-blue-400" },
  { label: "Resting HR", value: "62 bpm", trend: "-2 bpm", color: "text-red-400" },
  { label: "Hydration", value: "Optimal", trend: "Maintained", color: "text-cyan-400" },
  { label: "Recovery", value: "92%", trend: "+5%", color: "text-teal-400" },
];

export default function HealthTrends() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Health Trends"
    >
      <GlassCard className="relative overflow-hidden p-5 md:p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 h-full flex flex-col justify-between">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/60 to-transparent" />

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
            Biometrics
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#f8fafc]">
            Health Trends
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          {trends.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex flex-col justify-between">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94a3b8]">
                {item.label}
              </p>
              <div className="mt-2">
                <p className={`text-lg font-semibold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">
                  {item.trend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.section>
  );
}
