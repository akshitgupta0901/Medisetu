"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import { Users, CheckCircle, Clock, FileText, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { authFetch } from "@/lib/fetch-auth";

export default function DoctorAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("[Analytics] Fetching /api/doctors/analytics via authFetch...");
        const res = await authFetch("/api/doctors/analytics");
        console.log("[Analytics] HTTP status:", res.status);
        const data = await res.json();
        console.log("[Analytics] FETCH RESPONSE", data);
        if (data.success && data.stats) {
          console.log("[Analytics] SETTING STATS", data.stats);
          setStats(data.stats);
        } else {
          console.error("[Analytics] API returned failure:", data);
          setError(data.message || "Failed to load analytics");
        }
      } catch (error) {
        console.error("[Analytics] Failed to fetch analytics:", error);
        setError("Network error. Could not fetch analytics.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <main className="bg-slate-950 text-slate-200 min-h-screen">
        <Sidebar />
        <div className="md:ml-60">
          <TopBar />
          <div className="flex justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-slate-950 text-slate-200 min-h-screen">
        <Sidebar />
        <div className="md:ml-60">
          <TopBar />
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-slate-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  console.log("[Analytics] CURRENT STATS STATE", stats);

  const safeStats = {
    totalPatients: stats?.totalPatients ?? 0,
    completedAppointments: stats?.completedAppointments ?? 0,
    pendingAppointments: stats?.pendingAppointments ?? 0,
    approvedAppointments: stats?.approvedAppointments ?? 0,
    totalPrescriptions: stats?.totalPrescriptions ?? 0,
    trends: Array.isArray(stats?.trends) ? stats.trends : [],
  };

  const statCards = [
    { label: "Total Unique Patients",
    value: safeStats.totalPatients || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Appointments Completed", value: safeStats.completedAppointments || 0, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending Requests", value: safeStats.pendingAppointments || 0, icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Prescriptions Issued", value: safeStats.totalPrescriptions || 0, icon: FileText, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />

        <div className="p-4 md:p-6 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Clinical Analytics</h1>
            <p className="text-slate-400 mt-2">Data-driven insights into your clinical practice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((card, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition">
                <div className={`p-3 w-fit rounded-2xl ${card.bg} ${card.color} mb-4`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trend Chart Placeholder / Visualization */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  <h3 className="text-xl font-bold text-white">Consultation Trends</h3>
                </div>
                <span className="text-xs text-slate-500 font-bold uppercase">Last 6 Months</span>
              </div>

              <div className="space-y-6">
                {safeStats.trends?.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <p>Insufficient data to show trends</p>
                  </div>
                ) : (
                  safeStats.trends.map((trend: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300 font-medium">{trend.month}</span>
                        <span className="text-teal-400 font-bold">{trend.consultations} Consultations</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (trend.consultations / Math.max(1, ...safeStats.trends.map((t: any) => t.consultations))) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Workload Summary</h3>
              <div className="space-y-6">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Efficiency Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {safeStats.completedAppointments > 0 
                      ? Math.round((safeStats.completedAppointments / (safeStats.completedAppointments + safeStats.approvedAppointments + safeStats.pendingAppointments)) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Completed vs Total Scheduled</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Prescription Index</p>
                  <p className="text-2xl font-bold text-white">
                    {safeStats.completedAppointments > 0 
                      ? (safeStats.totalPrescriptions / safeStats.completedAppointments).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Avg prescriptions per consultation</p>
                </div>

                <div className="p-6 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                  <p className="text-sm text-teal-400 font-bold mb-2">Platform Insight</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Based on your consultation trends, your patient volume has {safeStats.trends.length > 1 && safeStats.trends[safeStats.trends.length-1].consultations >= safeStats.trends[safeStats.trends.length-2].consultations ? "increased" : "stabilized"} recently. 
                    Maintaining an efficiency rate above 80% is recommended for clinical excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
