"use client";

import { motion } from "framer-motion";

export default function AIListenBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-24 left-4 md:left-8 z-20 flex flex-col gap-3"
    >
      <div className="bg-slate-900/80 backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1 h-4 bg-teal-400 rounded-full animate-pulse" />
            <span className="w-1 h-5 bg-teal-400 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-3 bg-teal-400 rounded-full animate-pulse delay-150" />
          </div>

          <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
            AI Listening
          </span>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-xl px-4 py-2">
        <p className="text-xs text-emerald-300 font-medium">
          🌐 Hindi Translation Active
        </p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-xl px-4 py-2">
        <p className="text-xs text-blue-300 font-medium">
          📋 Symptom Match: 84%
        </p>
      </div>
    </motion.div>
  );
}