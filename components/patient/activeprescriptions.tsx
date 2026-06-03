"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

export default function ActivePrescriptions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Active Prescriptions"
    >
      <GlassCard className="relative overflow-hidden p-5 md:p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 h-full flex flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/60 to-transparent" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
              Pharmacy
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#f8fafc]">
              Active Prescriptions
            </h2>
          </div>
          <span className="text-teal-400 text-xl">💊</span>
        </div>

        <div className="flex-1 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-[#f8fafc]">Amoxicillin</p>
              <span className="text-[10px] uppercase font-bold text-teal-400">2 Refills</span>
            </div>
            <p className="mt-1 text-xs text-[#cbd5e1]">500mg, Twice a day</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-[#f8fafc]">Lisinopril</p>
              <span className="text-[10px] uppercase font-bold text-slate-400">0 Refills</span>
            </div>
            <p className="mt-1 text-xs text-[#cbd5e1]">10mg, Once a day</p>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
