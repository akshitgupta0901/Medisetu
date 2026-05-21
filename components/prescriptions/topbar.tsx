"use client";

import { motion } from "framer-motion";

export default function Topbar() {
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
        border-b
        border-slate-800
        bg-slate-950/80
        backdrop-blur-xl
      "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-gradient-to-br
              from-teal-400
              to-cyan-500
              flex
              items-center
              justify-center
              font-bold
              text-slate-950
            "
          >
            M
          </div>

          <div>
            <h1 className="font-bold text-lg text-teal-400">
              MediSetu AI
            </h1>

            <p className="text-xs text-slate-400">
              Smart Prescription Center
            </p>
          </div>
        </div>

        <button
          className="
            px-4
            py-2
            rounded-xl
            bg-teal-400
            text-slate-950
            font-semibold
            hover:scale-105
            transition
          "
        >
          Export
        </button>
      </div>
    </motion.header>
  );
}