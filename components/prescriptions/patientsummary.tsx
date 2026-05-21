"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

export default function PatientSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Sarah Miller
            </h2>

            <p className="text-slate-400 mt-1">
              Patient ID: #882-019
            </p>
          </div>

          <span
            className="
              w-fit
              px-4
              py-2
              rounded-full
              bg-teal-500/15
              border
              border-teal-500/30
              text-teal-400
              text-sm
              font-medium
            "
          >
            Stable
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Age
            </p>

            <p className="text-xl font-bold mt-1">
              42y
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Weight
            </p>

            <p className="text-xl font-bold mt-1">
              68kg
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              BMI
            </p>

            <p className="text-xl font-bold text-teal-400 mt-1">
              24.2
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}