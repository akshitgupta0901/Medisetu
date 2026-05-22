"use client";

import { motion } from "framer-motion";

export default function TriageVelocityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-2xl
        border
        border-teal-500/20
        bg-gradient-to-br
        from-slate-900
        to-slate-950
        p-6
        shadow-xl
      "
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-teal-400 text-sm font-semibold">
          AI Insights
        </span>

        <span className="text-2xl">⚡</span>
      </div>

      <p className="text-slate-400 text-sm uppercase">
        Triage Velocity
      </p>

      <h2 className="text-5xl font-bold text-teal-400 mt-2">
        4.2
      </h2>

      <p className="text-slate-400 mt-1">
        min / case
      </p>

      <div className="mt-5 text-emerald-400 text-sm">
        ↑ 12% faster today
      </div>
    </motion.div>
  );
}