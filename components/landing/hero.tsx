"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const patientSignals = [
  { label: "Cardiac risk", value: "Low", tone: "text-emerald-200" },
  { label: "Respiratory", value: "Stable", tone: "text-cyan-200" },
  { label: "Follow-up", value: "12 min", tone: "text-blue-200" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05101c] px-6 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-16 lg:pb-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#05101c_0%,#071827_48%,#03111f_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(90deg,rgba(45,212,191,0.08),rgba(96,165,250,0.1),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />

      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-center lg:text-left"
        >
          <motion.div
            variants={itemVariants}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 shadow-md shadow-cyan-950/15"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.75)]" />
            AI healthcare access layer
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Premium clinical AI for every connected care hub.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0"
          >
            MediSetu combines guided triage, remote diagnostics, and secure
            specialist escalation so healthcare teams can deliver faster care
            across rural and distributed communities.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#consult"
              className="inline-flex w-full items-center justify-center rounded-full bg-cyan-200 px-7 py-4 text-sm font-semibold text-[#06111d] shadow-lg shadow-cyan-500/15 transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06111d] sm:w-auto"
            >
              Start AI triage
            </a>

            <a
              href="#diagnostics"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 sm:w-auto"
            >
              View platform
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-10 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left shadow-lg shadow-slate-950/15 sm:max-w-xl"
          >
            {patientSignals.map((signal) => (
              <div key={signal.label} className="rounded-xl bg-white/[0.04] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  {signal.label}
                </p>
                <p className={`mt-2 text-sm font-semibold ${signal.tone}`}>
                  {signal.value}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative transform-gpu"
        >
          <div className="absolute -inset-x-4 inset-y-8 bg-cyan-300/[0.04]" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.12] bg-white/[0.06] p-4 shadow-xl shadow-black/25">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#071522]/90 p-4 sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
                    MediSetu Command
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Live diagnostic cockpit
                  </h2>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Online
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-300">
                        Patient intake
                      </p>
                      <span className="text-xs text-cyan-200">02:14</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {["Vitals synced", "Symptoms parsed", "Doctor matched"].map(
                        (step, index) => (
                          <div key={step} className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/10 text-xs font-bold text-cyan-100">
                              {index + 1}
                            </span>
                            <span className="text-sm text-slate-300">{step}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-200/10 bg-cyan-200/[0.06] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/60">
                      Escalation
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      87%
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      confidence for remote physician review
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        AI risk map
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Multimodal triage summary
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
                      Updated
                    </span>
                  </div>

                  <div className="mt-6 flex h-44 items-end gap-2 rounded-2xl bg-[#04101b] p-4">
                    {[42, 68, 54, 82, 63, 92, 76, 88].map((height, index) => (
                      <span
                        key={`${height}-${index}`}
                        style={{ height: `${height}%` }}
                        className="flex-1 rounded-t-full bg-gradient-to-t from-cyan-500/40 to-cyan-100"
                      />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-500">Wait reduction</p>
                      <p className="mt-1 text-lg font-semibold text-white">41%</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-500">Care routing</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-100">
                        24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
