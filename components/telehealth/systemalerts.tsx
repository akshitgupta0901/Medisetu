"use client";

import { motion } from "framer-motion";

export default function SystemAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-24 right-4 md:right-8 z-20"
    >
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 backdrop-blur-xl">
        <p className="text-red-300 text-xs font-semibold uppercase tracking-wide">
          ⚠ Low Bandwidth Detected
        </p>
      </div>
    </motion.div>
  );
}