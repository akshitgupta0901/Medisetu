"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const activity = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 86 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 96 },
  { day: "Fri", value: 72 },
  { day: "Sat", value: 38 },
  { day: "Sun", value: 58 },
];

export default function ActivityChart() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Weekly activity chart"
    >
      <GlassCard className="relative overflow-hidden p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/60 to-transparent" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#67e8f9]">
              Movement intelligence
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#f8fafc] md:text-3xl">
              Weekly Activity
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#94a3b8]">
              Movement trends for the last 7 days.
            </p>
          </div>

          <div className="rounded-2xl border border-[#67e8f9]/15 bg-[#67e8f9]/[0.055] px-5 py-4 text-left sm:text-right">
            <h3 className="text-3xl font-semibold tracking-tight text-[#a5f3fc]">
              7,432
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
              Steps avg
            </p>
          </div>
        </div>

        <div className="mt-8 grid min-h-64 grid-cols-7 items-end gap-2 rounded-3xl border border-white/10 bg-[#071827]/70 p-4 sm:gap-4 sm:p-6">
          {activity.map((item, index) => (
            <div key={item.day} className="flex h-full flex-col justify-end gap-3">
              <div className="flex flex-1 items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{
                    duration: 0.6,
                    delay: 0.18 + index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative w-full rounded-t-2xl bg-gradient-to-t from-[#0891b2]/45 via-[#22d3ee]/70 to-[#ccfbf1] shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                >
                  <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#0b1624] px-2 py-1 text-xs font-semibold text-[#cffafe] group-hover:block">
                    {item.value}%
                  </span>
                </motion.div>
              </div>
              <p className="text-center text-xs font-medium text-[#94a3b8]">
                {item.day}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.section>
  );
}
