"use client";

import { motion } from "framer-motion";

const vitals = [
  { label: "Oxygen", value: "94%", status: "Watch", tone: "text-amber-200" },
  { label: "Heart Rate", value: "112", status: "Elevated", tone: "text-red-200" },
  { label: "Respiration", value: "18", status: "Stable", tone: "text-cyan-200" },
];

export default function SeverityCard() {
  return (
    <motion.section
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20 lg:col-span-7 lg:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
      <div className="absolute right-0 top-0 h-40 w-40 bg-cyan-300/[0.05]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
            Severity engine
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            AI Severity Analysis
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Real-time risk stratification from patient symptoms, vitals, and
            clinical pattern matching.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.08] px-4 py-2 text-sm font-semibold text-cyan-100">
          <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.7)]" />
          84% confidence
        </div>
      </div>

      <div className="relative mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex justify-center">
          <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
            <div className="absolute inset-0 rounded-full border border-cyan-200/10 bg-cyan-200/[0.035]" />
            <motion.div
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-3 rounded-full border-[12px] border-cyan-200 border-l-amber-300 border-t-cyan-400"
            />
            <div className="absolute inset-9 rounded-full border border-white/10 bg-[#08121d]" />

            <div className="relative text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Risk level
              </p>
              <h3 className="mt-2 text-5xl font-semibold tracking-tight text-cyan-100">
                MOD
              </h3>
              <p className="mt-2 text-sm font-medium text-amber-200">
                Physician review advised
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {vitals.map((vital, index) => (
            <motion.div
              key={vital.label}
              initial={{ x: 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + index * 0.06 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{vital.label}</p>
                  <h4 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    {vital.value}
                  </h4>
                </div>
                <span
                  className={`rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold ${vital.tone}`}
                >
                  {vital.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
