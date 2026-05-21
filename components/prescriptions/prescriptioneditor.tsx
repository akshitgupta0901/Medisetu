"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

export default function PrescriptionEditor() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Prescription Editor
            </p>

            <h3 className="text-xl font-bold mt-2">
              Medication Details
            </h3>
          </div>

          <span className="text-xs text-slate-500">
            Autosaved 2 min ago
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Active Medication
            </label>

            <div className="relative">
              <input
                defaultValue="Lisinopril 10mg"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  outline-none
                  focus:border-teal-400
                "
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400">
                ✓
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Frequency
              </label>

              <select
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  outline-none
                "
              >
                <option>Once Daily (QD)</option>
                <option>Twice Daily (BID)</option>
                <option>Three Times Daily (TID)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Route
              </label>

              <select
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  outline-none
                "
              >
                <option>Oral</option>
                <option>Intravenous</option>
                <option>Injection</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}