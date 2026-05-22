"use client";

import { motion } from "framer-motion";

export default function AllergyAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Critical Allergy Alert */}
      <div
        className="
          rounded-2xl
          border
          border-red-500/30
          bg-red-500/10
          backdrop-blur-lg
          p-5
          shadow-lg
        "
      >
        <div className="flex gap-4 items-start">
          <div className="text-red-400 text-xl flex-shrink-0">
            ⚠️
          </div>

          <div>
            <h4 className="font-bold text-red-400">
              Critical Allergy Alert
            </h4>

            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Patient has documented anaphylactic reaction to
              <span className="ml-1 font-semibold text-red-400">
                Penicillin
              </span>.
            </p>
          </div>
        </div>
      </div>

      {/* Drug Interaction Alert */}
      <div
        className="
          rounded-2xl
          border
          border-teal-400/30
          bg-gradient-to-br
          from-slate-900/80
          to-teal-900/20
          backdrop-blur-lg
          p-5
          shadow-lg
        "
      >
        <div className="flex gap-4 items-start">
          <div className="text-teal-300 text-xl flex-shrink-0">
            ℹ️
          </div>

          <div>
            <h4 className="font-bold text-teal-300">
              Interaction Warning
            </h4>

            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Lisinopril + Ibuprofen may reduce antihypertensive effect
              and increase renal risk.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}