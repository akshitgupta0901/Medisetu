"use client";

import { motion } from "framer-motion";

export default function InsightsPanel() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        bg-slate-950
        border-t
        border-slate-800
        px-4
        md:px-8
        py-6
      "
    >
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <h4 className="text-xs uppercase text-slate-500 mb-2">
            Consultation Summary
          </h4>

          <p className="text-slate-300">
            Patient reports chest discomfort. Vitals stable.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase text-slate-500 mb-2">
            Risk Level
          </h4>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-emerald-300 text-sm">
            ● Low Risk
          </span>
        </div>

        <div>
          <h4 className="text-xs uppercase text-slate-500 mb-2">
            Suggested Rx
          </h4>

          <p className="text-slate-300">
            Aspirin 81mg • Nitroglycerin PRN
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase text-slate-500 mb-2">
            Live Symptoms
          </h4>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 text-xs">
              Chest Pain
            </span>

            <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 text-xs">
              Nausea
            </span>

            <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 text-xs">
              Sweating
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}