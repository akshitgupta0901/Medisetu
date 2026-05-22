"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

export default function AIInsight() {
  return (
    <motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="w-full max-w-2xl mx-auto px-4 sm:px-8 py-8"
>
  <GlassCard className="bg-gradient-to-br from-navy-950/70 to-teal-900/60 backdrop-blur-lg border border-teal-400/20 shadow-xl rounded-2xl p-8 sm:p-10">
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-200 tracking-tight mb-2">
            Renal Profile
          </h2>
          <p className="text-base sm:text-lg text-navy-100/80 leading-relaxed">
            renal profile.
          </p>
        </div>
      </div>

      <div
        className="
          rounded-2xl
          border
          border-teal-400/30
          bg-gradient-to-r from-teal-800/10 to-navy-900/20
          p-5 sm:p-6
          shadow-md
          flex items-center
        "
      >
        <p className="text-base sm:text-lg text-teal-200 font-medium flex items-center">
          <span className="mr-3 text-xl">✓</span>
          Dosage Verification Status:
          <span className="font-bold ml-3 text-teal-300 tracking-wide">
            PASSED
          </span>
        </p>
      </div>
    </div>
  </GlassCard>
</motion.div>
  );
}