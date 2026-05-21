"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const schedules = [
  {
    title: "Morning",
    dose: "10mg",
    time: "08:00 AM",
    active: true,
  },
  {
    title: "Evening",
    dose: "None",
    time: "Scheduled Monitor",
    active: false,
  },
];

export default function DosageSchedule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
          AI Verified Schedules
        </h3>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {schedules.map((item) => (
            <GlassCard
              key={item.title}
              className={`
                min-w-[180px]
                p-5
                transition-all
                hover:scale-[1.02]
                ${
                  item.active
                    ? "border-teal-500/30 bg-teal-500/10"
                    : ""
                }
              `}
            >
              <p
                className={`text-sm ${
                  item.active
                    ? "text-teal-400"
                    : "text-slate-400"
                }`}
              >
                {item.title}
              </p>

              <h4 className="text-2xl font-bold mt-2">
                {item.dose}
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                {item.time}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}