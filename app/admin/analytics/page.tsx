"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";
import { authFetch } from "@/lib/fetch-auth";
import type { AdminAnalyticsStats } from "@/types/admin";
import { Loader2, Users, Calendar, Pill, CheckCircle, Clock } from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<AdminAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authFetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
        else setError(data.message ?? "Failed to load analytics");
        setLoading(false);
      })
      .catch(() => {
        setError("Network error");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-300 p-20 text-center">
        {error ?? "Failed to load stats"}
      </div>
    );
  }

  const cards = [
    { label: "Total Doctors", value: stats.totalDoctors, icon: Users, color: "text-blue-400" },
    { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "text-purple-400" },
    { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, color: "text-teal-400" },
    { label: "Completed", value: stats.completedAppointments, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Pending", value: stats.pendingAppointments, icon: Clock, color: "text-amber-400" },
    { label: "Prescriptions", value: stats.totalPrescriptions, icon: Pill, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="md:ml-60">
        <Topbar />
        <main className="p-8">
          <h1 className="text-3xl font-bold mb-8">System Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {cards.map((card, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <card.icon className={`w-8 h-8 mb-4 ${card.color}`} />
                <p className="text-sm text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-4xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
