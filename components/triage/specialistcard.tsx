"use client";

import { motion } from "framer-motion";

export default function SpecialistCard() {
  return (
    <motion.section
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
            Routing
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Specialist Route
          </h2>
        </div>
        <span className="rounded-full border border-red-200/20 bg-red-200/10 px-3 py-1 text-xs font-semibold text-red-100">
          P1
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-200/10 bg-cyan-200/[0.05] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-lg font-semibold text-cyan-100">
            C
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-cyan-100">
              Cardiologist
            </h3>
            <p className="mt-1 text-sm text-slate-400">Priority 1 referral</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/[0.045] p-3">
            <p className="text-xs text-slate-500">ETA</p>
            <p className="mt-1 text-sm font-semibold text-white">8 min</p>
          </div>
          <div className="rounded-xl bg-white/[0.045] p-3">
            <p className="text-xs text-slate-500">Match</p>
            <p className="mt-1 text-sm font-semibold text-cyan-100">96%</p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 w-full rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#06111d] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101a24]"
        >
          Book now
        </button>
      </div>
    </motion.section>
  );
}
