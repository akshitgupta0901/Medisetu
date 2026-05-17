"use client";

import { motion } from "framer-motion";

const actions = [
  { label: "Schedule consultation", primary: true },
  { label: "Run diagnostic ECG", primary: false },
  { label: "Share case summary", primary: false },
];

export default function ActionPlan() {
  return (
    <motion.section
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
        Next best action
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
        AI Action Plan
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Recommended care operations based on the current risk state.
      </p>

      <div className="mt-6 space-y-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            type="button"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.28 + index * 0.05 }}
            className={`w-full rounded-full px-5 py-3.5 text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 ${
              action.primary
                ? "bg-cyan-200 text-[#06111d] shadow-lg shadow-cyan-500/15 hover:-translate-y-0.5 hover:bg-white"
                : "border border-white/10 bg-white/[0.045] text-white hover:-translate-y-0.5 hover:border-cyan-200/25 hover:bg-white/[0.08]"
            }`}
          >
            {action.label}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
