"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PatientCard from "./patientcard";
import { authFetch } from "@/lib/fetch-auth";
import type { TriageReportRow } from "@/types/triage";
import { Loader2 } from "lucide-react";

export default function PatientQueue() {
  const [patients, setPatients] = useState<TriageReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQueue() {
      try {
        const res = await authFetch("/api/triage?status=Pending");
        const data = await res.json();
        if (res.ok && data.success) {
          setPatients(data.reports.slice(0, 5)); // show top 5 active
        } else {
          setError(data.message || "Failed to load queue.");
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
    <section>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-bold text-white">
          Active Patient Queue
        </h3>

        <Link href="/doctor/queue" className="text-teal-400 hover:text-teal-300 transition">
          View Full Queue →
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 border border-red-500/20 bg-red-500/10 rounded-xl text-sm">{error}</div>
        ) : patients.length === 0 ? (
          <div className="text-slate-400 p-8 text-center border border-slate-800 bg-slate-900/50 rounded-xl text-sm">No patients in queue.</div>
        ) : (
          patients.map((p) => (
            <PatientCard
              key={p.id}
              name={p.patientName || "Unknown Patient"}
              age={p.age || 0}
              status={p.status}
              issue={p.symptoms}
            />
          ))
        )}
      </div>
    </section>
  );
}