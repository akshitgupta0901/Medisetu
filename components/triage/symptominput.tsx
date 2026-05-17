"use client";

import { motion } from "framer-motion";

const symptoms = [
  { label: "Chest pain", confidence: "92%" },
  { label: "Shortness of breath", confidence: "86%" },
  { label: "Nausea", confidence: "61%" },
];

export default function SymptomInput() {
  return (
    <motion.section
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20 lg:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/40 to-transparent" />

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
            Intake stream
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Symptom Input
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Captured signals from patient conversation and structured clinical
            prompts.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#06111d] shadow-lg shadow-cyan-500/15 transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101a24]"
          >
            Voice capture
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/25 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
          >
            Manual entry
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {symptoms.map((symptom, index) => (
          <motion.div
            key={symptom.label}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.2 + index * 0.06 }}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">
                {symptom.label}
              </span>
              <span className="rounded-full bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                {symptom.confidence}
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-teal-300"
                style={{ width: symptom.confidence }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
