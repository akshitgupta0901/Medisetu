"use client";

import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-16
        bg-slate-950/80
        backdrop-blur-xl
        border-b
        border-slate-800
      "
    >
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100"
            alt="Doctor"
            className="w-10 h-10 rounded-full border border-teal-400"
          />

          <div>
            <h1 className="text-lg font-bold text-teal-400">
              Clinical Session
            </h1>

            <p className="text-xs text-slate-400">
              Dr. Sarah Jenkins • ID: 882-01
            </p>
          </div>
        </div>

        <button
          className="
            p-2
            rounded-full
            border
            border-red-500/30
            bg-red-500/10
            hover:bg-red-500/20
            transition
          "
        >
          🚨
        </button>
      </div>
    </motion.header>
  );
}