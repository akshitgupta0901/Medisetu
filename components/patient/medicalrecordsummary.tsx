"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "./glasscard";
import { authFetch } from "@/lib/fetch-auth";
import type { SafePatientRecord } from "@/types/patient-record";

export default function MedicalRecordSummary() {
  const [record, setRecord] = useState<SafePatientRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/patients");
        const data = await res.json();
        if (res.ok && data.success && data.records.length > 0) {
          setRecord(data.records[0]);
        }
      } catch {
        /* no record yet */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const allergyCount = record?.allergies.length ?? 0;
  const medCount = record?.medications.length ?? 0;
  const historyCount = record?.medicalHistory.length ?? 0;

  return (
    <motion.section
      className="md:col-span-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      aria-label="Medical record summary"
    >
      <GlassCard className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/60 to-transparent" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
              Medical record
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#f8fafc]">
              {loading ? "Loading..." : record ? "Profile on file" : "No record yet"}
            </h2>
          </div>
          {record && (
            <span className="rounded-full border border-[teal-400]/30 bg-[teal-400]/10 px-3 py-1 text-xs font-semibold text-[teal-400]">
              {record.bloodGroup}
            </span>
          )}
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-[slate-400]">Fetching health data...</p>
        ) : !record ? (
          <div className="mt-5">
            <p className="text-sm text-[slate-400] mb-4">
              Create your medical profile to track allergies, medications, and history.
            </p>
            <Link
              href="/patient/profile"
              className="inline-block bg-[teal-400] text-black px-5 py-2.5 rounded-xl font-semibold text-sm"
            >
              Create Profile
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase text-[#94a3b8]">Allergies</p>
                <p className="mt-1 text-sm font-semibold text-[#f87171]">
                  {allergyCount || "None"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase text-[#94a3b8]">Medications</p>
                <p className="mt-1 text-sm font-semibold text-teal-400">{medCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase text-[#94a3b8]">History</p>
                <p className="mt-1 text-sm font-semibold text-blue-400">{historyCount}</p>
              </div>
            </div>

            {record.allergies.length > 0 && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-950/20 p-3">
                <p className="text-xs text-red-300 font-medium">Allergies</p>
                <p className="text-sm text-[#fca5a5] mt-1">
                  {record.allergies.join(", ")}
                </p>
              </div>
            )}

            <Link
              href="/patient/profile"
              className="mt-4 inline-block text-sm text-[teal-400] hover:underline"
            >
              View full profile →
            </Link>
          </>
        )}
      </GlassCard>
    </motion.section>
  );
}
