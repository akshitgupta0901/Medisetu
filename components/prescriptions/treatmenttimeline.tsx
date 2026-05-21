"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const phases = [
  {
    title: "Initiation Phase",
    description:
      "Day 1-7: Low dose titration monitoring blood pressure.",
    active: true,
  },
  {
    title: "Stabilization Phase",
    description:
      "Day 8-21: Adjustment based on laboratory panels.",
    active: false,
  },
];

export default function TreatmentTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassCard className="p-6">
        <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-6">
          Current Treatment Plan
        </h3>

        <div className="relative border-l border-slate-700 pl-6 space-y-8">
          {phases.map((phase) => (
            <div key={phase.title} className="relative">
              <div
                className={`
                  absolute
                  -left-[33px]
                  top-1
                  w-4
                  h-4
                  rounded-full
                  border-4
                  border-slate-950
                  ${
                    phase.active
                      ? "bg-teal-400"
                      : "bg-slate-600"
                  }
                `}
              />

              <h4
                className={`font-semibold ${
                  phase.active
                    ? "text-teal-400"
                    : "text-slate-300"
                }`}
              >
                {phase.title}
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}