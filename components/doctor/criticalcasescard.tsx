"use client";

import { motion } from "framer-motion";

export default function CriticalCasesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="
        rounded-2xl
        border
        border-red-500/30
        bg-red-950/20
        p-6
      "
    >
      <div className="flex justify-between items-center">
        <span className="text-red-400 text-sm font-semibold">
          High Priority
        </span>

        <span className="text-2xl">🚨</span>
      </div>

      <p className="text-slate-400 text-sm uppercase mt-5">
        Critical Cases
      </p>

      <h2 className="text-5xl font-bold text-red-400 mt-2">
        03
      </h2>

      <p className="text-slate-400 mt-4">
        Immediate action required
      </p>
    </motion.div>
  );
}