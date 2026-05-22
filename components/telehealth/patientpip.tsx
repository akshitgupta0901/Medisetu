"use client";

import { motion } from "framer-motion";

export default function PatientPIP() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
        absolute
        bottom-10
        right-4
        md:right-8
        z-30
      "
    >
      <div
        className="
          w-44
          md:w-60
          aspect-video
          overflow-hidden
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        "
      >
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"
          alt="Patient"
          className="w-full h-full object-cover"
        />

        <div
          className="
            absolute
            bottom-2
            left-2
            bg-black/60
            backdrop-blur-md
            rounded-full
            px-3
            py-1
            text-xs
            flex
            items-center
            gap-2
          "
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          YOU
        </div>
      </div>
    </motion.div>
  );
}