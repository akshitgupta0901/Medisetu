"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import MobileBottomNav from "@/components/doctor/mobilebottomnav";
import PatientCard from "@/components/doctor/patientcard";
import { authFetch } from "@/lib/fetch-auth";
import type { TriageReportRow } from "@/types/triage";
import { Loader2 } from "lucide-react";

export default function DoctorQueuePage() {
  const [patients, setPatients] = useState<TriageReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQueue() {
      try {
        const res = await authFetch("/api/triage"); // Fetch all patients for doctor
        const data = await res.json();
        if (res.ok && data.success) {
          setPatients(data.reports);
        } else {
          setError(data.message || "Failed to load full queue.");
        }
      } catch (err) {
        setError("Network error fetching patient queue.");
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="md:ml-[240px]">
        <TopBar />

        <main className="p-6 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Full Patient Queue</h1>
          </div>

          {loading ? (
            <div className="flex justify-center p-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-400 p-6 border border-red-500/20 bg-red-500/10 rounded-xl max-w-2xl">{error}</div>
          ) : patients.length === 0 ? (
            <div className="text-slate-400 p-12 text-center border border-slate-800 bg-slate-900/50 rounded-xl max-w-2xl">
              No patients in the queue at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {patients.map((p) => (
                <PatientCard
                  key={p.id}
                  name={p.patientName || "Unknown Patient"}
                  age={p.age || 0}
                  status={p.status}
                  issue={p.symptoms}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
