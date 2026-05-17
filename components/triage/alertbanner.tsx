"use client";

import { motion } from "framer-motion";

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 8v5m0 3.5h.01M10.2 4.8 3 17.3A1.8 1.8 0 0 0 4.6 20h14.8a1.8 1.8 0 0 0 1.6-2.7L13.8 4.8a2.1 2.1 0 0 0-3.6 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AlertBanner() {
  return (
    <motion.section
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-red-300/20 bg-red-400/[0.08] p-5 shadow-lg shadow-red-950/10 sm:p-6"
      aria-label="Critical triage alert"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200/55 to-transparent" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-200/20 bg-red-200/10 text-red-100">
            <AlertIcon />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-red-100">
                Critical alert
              </h2>
              <span className="rounded-full border border-red-200/20 bg-red-200/10 px-3 py-1 text-xs font-semibold text-red-100">
                Priority review
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-red-50/85">
              High-priority triage required for Patient #8842. Review cardiac
              indicators and specialist routing before discharge.
            </p>
          </div>
        </div>

        <a
          href="#"
          className="inline-flex items-center justify-center rounded-full bg-red-100 px-5 py-3 text-sm font-semibold text-[#16090b] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#16090b]"
        >
          Review case
        </a>
      </div>
    </motion.section>
  );
}
