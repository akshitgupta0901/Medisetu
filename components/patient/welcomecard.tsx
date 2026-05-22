"use client";

import { motion, type Variants } from "framer-motion";
import GlassCard from "./glasscard";
import VitalChip from "./vitalchip";
import { useAuth } from "@/contexts/auth-context";
import UserAvatar from "@/components/auth/user-avatar";
import { getFirstName, getShortId } from "@/lib/user-display";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12 3.5 13.8 9l5.7 1.5-5.7 1.6L12 17.5l-1.8-5.4-5.7-1.6L10.2 9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WelcomeCard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user ? getFirstName(user.name) : "there";

  return (
    <motion.section
      className="md:col-span-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Patient welcome and vital snapshot"
    >
      <GlassCard className="group relative h-full overflow-hidden p-6 transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20 md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/60 to-transparent" />

        <div className="relative flex h-full flex-col gap-7 md:flex-row md:items-center md:gap-8">
          <motion.div variants={itemVariants} className="relative shrink-0">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#67e8f9]/25 to-[#2dd4bf]/10" />
            {user ? (
              <UserAvatar
                user={user}
                size="lg"
                className="relative !rounded-3xl border-[#67e8f9]/25"
              />
            ) : (
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-[#67e8f9]/25 bg-[#071827] text-2xl font-semibold text-[#cffafe]" />
            )}
            <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-[#071827] bg-[#5eead4] shadow-[0_0_14px_rgba(94,234,212,0.75)]" />
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.div variants={itemVariants}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#67e8f9]/15 bg-[#67e8f9]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a5f3fc]">
                  AI Health Companion
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-[#f8fafc] md:text-4xl">
                {greeting},{" "}
                <span className="bg-gradient-to-r from-[#a5f3fc] to-[#5eead4] bg-clip-text text-transparent">
                  {firstName}.
                </span>
              </h2>

              {user && (
                <p className="mt-2 text-sm font-medium tracking-[0.16em] text-[#94a3b8]">
                  PATIENT ID:{" "}
                  <span className="text-[#cbd5e1]">MS-{getShortId(user._id)}</span>
                </p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <VitalChip label="Heart Rate" value="72" unit="BPM" />
              <VitalChip label="Blood Oxygen" value="98" unit="%" />
              <VitalChip label="Glucose" value="5.4" unit="mmol/L" />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-5 flex items-start gap-3 rounded-2xl border border-[#67e8f9]/15 bg-[#67e8f9]/[0.055] px-4 py-3"
            >
              <span className="mt-0.5 text-[#a5f3fc]">
                <SparkIcon />
              </span>
              <p className="text-sm leading-6 text-[#cbd5e1]">
                AI review shows stable vitals with no anomaly pattern in the
                last <span className="font-semibold text-[#5eead4]">24 hours</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
