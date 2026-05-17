"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Symptom Ingestion",
    description: "Patient voice capture parsed and mapped to clinical terms.",
    status: "Complete",
    active: false,
  },
  {
    title: "Diagnostic Cross-Reference",
    description: "Matched against 5.4M anonymized clinical case patterns.",
    status: "Complete",
    active: false,
  },
  {
    title: "Recommendation Engine",
    description: "Calculating care pathway and specialist escalation.",
    status: "Processing",
    active: true,
  },
];

export default function ProcessingTimeline() {
  return (
    <motion.section
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20 lg:col-span-5 lg:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
            Processing queue
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            AI Processing Steps
          </h2>
        </div>
        <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-semibold text-amber-100">
          Live
        </span>
      </div>

      <div className="relative mt-8 space-y-6">
        <div className="absolute bottom-6 left-[13px] top-6 w-px bg-white/10" />

        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ x: 12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.16 + index * 0.07 }}
            className="relative flex gap-4"
          >
            <span
              className={`relative z-10 mt-1 h-7 w-7 rounded-full border ${
                step.active
                  ? "border-amber-200/40 bg-amber-200/15"
                  : "border-cyan-200/30 bg-cyan-200/10"
              }`}
            >
              <span
                className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  step.active ? "animate-pulse bg-amber-200" : "bg-cyan-200"
                }`}
              />
            </span>

            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-cyan-200/20 hover:bg-white/[0.06]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    step.active
                      ? "bg-amber-200/10 text-amber-100"
                      : "bg-cyan-200/10 text-cyan-100"
                  }`}
                >
                  {step.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
