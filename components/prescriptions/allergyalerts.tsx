"use client";

import { motion } from "framer-motion";

export default function AllergyAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      {/* Allergy Alert */}

      <div
        className="
          rounded-2xl
          border
          border-red-500/30
          bg-red-500/10
          p-5
        "
      >
        <div className="flex gap-4">
          <div className="text-red-400 text-xl">
            ⚠️
          </div>

          <div>
            <h4 className="font-bold text-red-400">
              Critical Allergy Alert
            </h4>

            <p className="text-sm text-slate-300 mt-2">
              Patient has documented anaphylactic
              reaction to
              <span className="font-semibold text-red-400 ml-1">
                Penicillin
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Interaction Alert */}

      <div
        className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-5
        "
      >
        <div className="flex gap-4">
          <div className="text-cyan-400 text-xl">
            ℹ️
          </div>

          <div>
            <h4 className="font-bold text-cyan-400">
              Interaction Warning
            </h4>

            <p className="text-sm text-slate-400 mt-2">
              Lisinopril + Ibuprofen may reduce
              antihypertensive effect and increase
              renal risk.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}