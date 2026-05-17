"use client";

import { motion } from "framer-motion";

const statuses = [
  { label: "AI Triage Online", tone: "bg-emerald-300", active: true },
  { label: "Secure Sync", tone: "bg-cyan-300", active: false },
  { label: "Multilingual", tone: "bg-blue-300", active: false },
  { label: "Optimized", tone: "bg-teal-300", active: false },
];

export default function Statusbar() {
  return (
    <div className="overflow-x-auto border-b border-white/10 bg-[#08131f] px-4 py-3 lg:ml-[280px] lg:px-6">
      <div className="flex min-w-max items-center gap-3 text-sm">
        {statuses.map((status, index) => (
          <motion.div
            key={status.label}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-slate-300"
          >
            <span
              className={`h-2 w-2 rounded-full ${status.tone} ${
                status.active ? "animate-pulse shadow-[0_0_12px_rgba(94,234,212,0.75)]" : ""
              }`}
            />
            <span className={status.active ? "font-semibold text-cyan-100" : ""}>
              {status.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
