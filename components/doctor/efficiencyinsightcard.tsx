"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function EfficiencyInsightCard() {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="
        rounded-2xl
        border
        border-teal-500/20
        bg-slate-900
        p-6
      "
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-teal-400 text-xl">
          ✨
        </span>

        <span className="font-semibold text-teal-300">
          AI Copilot
        </span>
      </div>

      <p className="text-slate-300 leading-relaxed">
        AI Copilot reduced charting time by
        <span className="text-teal-400 font-bold">
          {" "}32%
        </span>
        today.
      </p>

      <button
        onClick={() => router.push("/doctor/ai-reports")}
        className="
          mt-6
          w-full
          bg-teal-500
          hover:bg-teal-400
          text-slate-950
          py-3
          rounded-xl
          font-semibold
          transition
        "
      >
        View AI Reports
      </button>
    </motion.div>
  );
}