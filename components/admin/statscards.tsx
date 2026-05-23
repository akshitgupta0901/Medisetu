"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authFetch } from "@/lib/fetch-auth";
import type { AdminAnalyticsStats } from "@/types/admin";

const CARD_CONFIG = [
  {
    key: "totalDoctors" as const,
    label: "Total Doctors",
    badge: "Workforce",
    icon: "👨‍⚕️",
    border: "border-blue-500/20",
    gradient: "from-slate-900 to-blue-950/40",
    valueColor: "text-blue-300",
  },
  {
    key: "totalPatients" as const,
    label: "Total Patients",
    badge: "Population",
    icon: "👥",
    border: "border-teal-500/20",
    gradient: "from-slate-900 to-slate-950",
    valueColor: "text-teal-400",
  },
  {
    key: "totalAppointments" as const,
    label: "Total Appointments",
    badge: "Scheduling",
    icon: "📅",
    border: "border-teal-500/20",
    gradient: "from-slate-900 to-slate-950",
    valueColor: "text-teal-400",
  },
  {
    key: "completedAppointments" as const,
    label: "Completed",
    badge: "Completed",
    icon: "✅",
    border: "border-emerald-500/20",
    gradient: "from-slate-900 to-emerald-950/20",
    valueColor: "text-emerald-400",
  },
  {
    key: "pendingAppointments" as const,
    label: "Pending",
    badge: "Pending",
    icon: "⏳",
    border: "border-amber-500/20",
    gradient: "from-slate-900 to-amber-950/20",
    valueColor: "text-amber-400",
  },
  {
    key: "totalPrescriptions" as const,
    label: "Prescriptions",
    badge: "Clinical",
    icon: "💊",
    border: "border-orange-500/20",
    gradient: "from-slate-900 to-orange-950/20",
    valueColor: "text-orange-300",
  },
];

export default function StatsCards() {
  const [stats, setStats] = useState<AdminAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/admin/analytics");
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      } else {
        setError(data.message ?? "Failed to load analytics");
      }
    } catch {
      setError("Network error loading analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {CARD_CONFIG.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 animate-pulse h-36"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
        <p className="text-red-300 text-sm">{error}</p>
        <button
          type="button"
          onClick={fetchStats}
          className="mt-3 text-sm text-teal-400 hover:underline"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {CARD_CONFIG.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className={`rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} p-5 md:p-6 shadow-xl`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {card.badge}
            </span>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-slate-400 text-xs uppercase">{card.label}</p>
          <h2 className={`text-3xl md:text-4xl font-bold ${card.valueColor} mt-2`}>
            {stats[card.key].toLocaleString()}
          </h2>
        </motion.div>
      ))}
    </section>
  );
}
