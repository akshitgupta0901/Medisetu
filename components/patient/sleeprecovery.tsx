"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const sleepStages = [
  { label: "Deep", value: "2h 10m", width: "32%", color: "bg-[#67e8f9]" },
  { label: "REM", value: "1h 35m", width: "24%", color: "bg-[#5eead4]" },
  { label: "Light", value: "3h 35m", width: "44%", color: "bg-[#93c5fd]" },
];

const recoverySignals = [
  { label: "HRV", value: "+8%" },
  { label: "Resting HR", value: "61" },
  { label: "Recovery", value: "Good" },
];

export default function SleepRecovery() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Rest and recovery"
    >
      <GlassCard className="relative overflow-hidden p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/60 to-transparent" />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5eead4]">
              Recovery analytics
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#f8fafc] md:text-3xl">
              Rest & Recovery
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#94a3b8]">
              Deep sleep, REM balance, and overnight recovery quality.
            </p>

            <div className="mt-6 flex items-end gap-3">
              <h3 className="text-4xl font-semibold tracking-tight text-[#ccfbf1]">
                7h 20m
              </h3>
              <p className="pb-1 text-sm font-medium text-[#5eead4]">
                +42m vs baseline
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {recoverySignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94a3b8]">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#cffafe]">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#071827]/70 p-5">
            <div className="flex h-28 overflow-hidden rounded-2xl bg-white/[0.04]">
              {sleepStages.map((stage, index) => (
                <motion.div
                  key={stage.label}
                  initial={{ width: 0 }}
                  animate={{ width: stage.width }}
                  transition={{
                    duration: 0.65,
                    delay: 0.2 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`${stage.color} relative`}
                >
                  <span className="absolute inset-x-0 bottom-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#06111d]">
                    {stage.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {sleepStages.map((stage) => (
                <div
                  key={stage.label}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                    <span className="text-sm font-medium text-[#e2e8f0]">
                      {stage.label} sleep
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#cbd5e1]">
                    {stage.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
