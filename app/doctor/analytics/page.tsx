"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import { Users, CheckCircle, Clock, FileText, TrendingUp, Loader2 } from "lucide-react";

export default function DoctorAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/doctors/analytics");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
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

  const statCards = [
    { label: "Total Unique Patients", value: stats.totalPatients, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Appointments Completed", value: stats.completedAppointments, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending Requests", value: stats.pendingAppointments, icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Prescriptions Issued", value: stats.totalPrescriptions, icon: FileText, color: "text-purple-400", bg: "bg-purple-400/10" },
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
                {stats.trends.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <p>Insufficient data to show trends</p>
                  </div>
                ) : (
                  stats.trends.map((trend: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300 font-medium">{trend.month}</span>
                        <span className="text-teal-400 font-bold">{trend.consultations} Consultations</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (trend.consultations / Math.max(...stats.trends.map((t: any) => t.consultations))) * 100)}%` }}
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
                    {stats.completedAppointments > 0 
                      ? Math.round((stats.completedAppointments / (stats.completedAppointments + stats.approvedAppointments + stats.pendingAppointments)) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Completed vs Total Scheduled</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Prescription Index</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.completedAppointments > 0 
                      ? (stats.totalPrescriptions / stats.completedAppointments).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Avg prescriptions per consultation</p>
                </div>

                <div className="p-6 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                  <p className="text-sm text-teal-400 font-bold mb-2">Platform Insight</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Based on your consultation trends, your patient volume has {stats.trends.length > 1 && stats.trends[stats.trends.length-1].consultations >= stats.trends[stats.trends.length-2].consultations ? "increased" : "stabilized"} recently. 
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
