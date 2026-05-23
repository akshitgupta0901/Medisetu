"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";
import type { TriageAnalytics, TriageReportRow } from "@/types/triage";
import { exportData } from "@/lib/export-data";
import Link from "next/link";

export default function TriageDashboard() {
  const [analytics, setAnalytics] = useState<TriageAnalytics | null>(null);
  const [reports, setReports] = useState<TriageReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = severityFilter !== "all" ? `?severity=${severityFilter}` : "";
      const [statsRes, listRes] = await Promise.all([
        authFetch("/api/triage/analytics"),
        authFetch(`/api/triage${params}`),
      ]);
      const statsData = await statsRes.json();
      const listData = await listRes.json();
      if (statsRes.ok && statsData.success) setAnalytics(statsData.analytics);
      if (listRes.ok && listData.success) setReports(listData.reports);
      if (!statsRes.ok && !listRes.ok) {
        setError(statsData.message ?? listData.message ?? "Failed to load triage data");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [severityFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const cards = analytics
    ? [
        { label: "Total reports", value: analytics.totalReports },
        { label: "High severity", value: analytics.highSeverityReports },
        { label: "Pending review", value: analytics.pendingReview },
        { label: "Avg severity score", value: analytics.averageSeverityScore },
        { label: "Completed today", value: analytics.completedToday },
      ]
    : [];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
          <button type="button" onClick={load} className="ml-3 text-teal-400 underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-400 py-12">Loading triage dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-white/10 bg-[#101a24] p-4"
              >
                <p className="text-xs text-slate-500 uppercase">{c.label}</p>
                <p className="text-2xl font-bold text-cyan-300 mt-2">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
            >
              <option value="all">All severities</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <Link
              href="/ai-triage"
              className="text-sm text-teal-400 hover:underline"
            >
              Open symptom checker →
            </Link>
          </div>

          {reports.length === 0 ? (
            <p className="text-center text-slate-400 py-12">No triage reports found.</p>
          ) : (
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 text-xs uppercase border-b border-slate-800 bg-slate-900/80">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {reports.slice(0, 15).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="p-4 text-white">{r.patientName ?? r.patientId}</td>
                      <td className="p-4 capitalize text-amber-300">{r.severity}</td>
                      <td className="p-4 text-cyan-300">{r.triageScore}</td>
                      <td className="p-4 text-slate-300">{r.status}</td>
                      <td className="p-4 text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
