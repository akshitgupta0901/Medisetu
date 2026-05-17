"use client";

import { motion } from "framer-motion";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M15 17H9m9-1.5c-.8-.9-1.2-2.1-1.2-3.4V10a4.8 4.8 0 0 0-9.6 0v2.1c0 1.3-.4 2.5-1.2 3.4L5.4 16h13.2l-.6-.5ZM13.5 20a1.8 1.8 0 0 1-3 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Topbar() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-white/10 bg-[#07111d]/95 px-4 py-3 shadow-lg shadow-black/10 lg:ml-[280px] lg:px-6"
    >
      <div className="min-w-0">
        <p className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/55 sm:block">
          AI triage dashboard
        </p>
        <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
          Patient #8842 clinical command
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-slate-300 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.55)]" />
          Low bandwidth
        </div>

        <div className="hidden rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-slate-300 sm:block">
          English (US)
        </div>

        <button
          type="button"
          aria-label="View clinical notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-slate-300 transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
        >
          <BellIcon />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
        </button>

        <button
          type="button"
          aria-label="Open clinician profile"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] p-1 pr-3 transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 text-xs font-semibold text-cyan-100"
          >
            SM
          </span>
          <span className="hidden text-sm font-medium text-slate-200 md:block">
            Dr. Miller
          </span>
        </button>
      </div>
    </motion.header>
  );
}
