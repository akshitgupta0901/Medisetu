"use client";

import { motion } from "framer-motion";

export default function TranscriptCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        absolute
        bottom-4
        left-1/2
        -translate-x-1/2
        z-30
        w-[90%]
        md:w-[550px]
      "
    >
      <div className="rounded-2xl border border-teal-500/20 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
            ✨
          </div>

          <div className="flex-1">
            <h3 className="text-teal-300 text-xs font-semibold uppercase tracking-widest">
              Real-Time Analysis
            </h3>

            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              “Since yesterday, the discomfort in the chest has been recurring
              every 4–5 hours.”
            </p>

            <div className="h-px bg-slate-700 my-3" />

            <p className="text-emerald-300 text-sm">
              💡 AI Suggestion: Ask about radiating pain in the left arm.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}