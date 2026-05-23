"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authFetch } from "@/lib/fetch-auth";

export default function TriageVelocityCard() {
  const [pending, setPending] = useState<number | null>(null);
  const [avgScore, setAvgScore] = useState<number | null>(null);

  useEffect(() => {
    authFetch("/api/triage/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPending(data.analytics.pendingReview);
          setAvgScore(data.analytics.averageSeverityScore);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-teal-400 text-sm font-semibold">AI Triage</span>
        <span className="text-2xl">⚡</span>
      </div>
      <p className="text-slate-400 text-sm uppercase">Pending review</p>
      <h2 className="text-5xl font-bold text-teal-400 mt-2">
        {pending === null ? "—" : pending}
      </h2>
      <p className="text-slate-400 mt-1 text-sm">
        Avg severity score: {avgScore === null ? "—" : avgScore}
      </p>
    </motion.div>
  );
}
