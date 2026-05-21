"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

export default function AIInsight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassCard
        className="
          p-6
          border-teal-500/20
          relative
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            right-0
            top-0
            w-40
            h-40
            rounded-full
            bg-teal-500/10
            blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-teal-500/10
                flex
                items-center
                justify-center
                text-teal-400
              "
            >
              AI
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal-400">
                AI Insight Analysis
              </h3>

              <p className="text-sm text-slate-400">
                Smart prescription validation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div
              className="
                w-20
                h-20
                rounded-full
                border-4
                border-teal-400
                flex
                items-center
                justify-center
                text-xl
                font-bold
                text-teal-400
              "
            >
              98%
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                Recommendation Confirmed
              </h4>

              <p className="text-slate-400 text-sm mt-1">
                Optimal dosage for patient weight and
                renal profile.
              </p>
            </div>
          </div>

          <div
            className="
              rounded-xl
              border
              border-teal-500/20
              bg-teal-500/5
              p-4
            "
          >
            <p className="text-sm text-teal-300">
              ✓ Dosage Verification Status:
              <span className="font-bold ml-2">
                PASSED
              </span>
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}