"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

export default function AIHealthInsights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      aria-label="AI Health Insights"
    >
      <GlassCard className="relative overflow-hidden p-5 md:p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 h-full flex flex-col justify-between">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/60 to-transparent" />

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
            Copilot
          </p>
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-xl font-semibold tracking-tight text-[#f8fafc]">
              AI Health Insights
            </h2>
            <span className="text-teal-400 text-lg">✨</span>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-300 mb-1">
              Weekly Summary
            </p>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Your overall health stability is excellent. Consistent sleep and active movement patterns contributed to a 4% rise in your health score.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300 mb-1">
                Risk Alerts
              </p>
              <p className="text-xs text-[#fca5a5]">
                None detected. Heart rate variability is normal.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300 mb-1">
                Suggestions
              </p>
              <p className="text-xs text-cyan-100">
                Increase afternoon water intake to maintain hydration.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
