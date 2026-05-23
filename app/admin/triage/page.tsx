"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageShell from "@/components/admin/admin-page-shell";
import ExportButton from "@/components/admin/export-button";
import { authFetch } from "@/lib/fetch-auth";
import type { TriageReportRow } from "@/types/triage";

export default function AdminTriagePage() {
  const [items, setItems] = useState<TriageReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      const res = await authFetch(`/api/admin/triage?${params}`);
      const data = await res.json();
      if (res.ok && data.success) setItems(data.items);
      else setError(data.message ?? "Failed to load");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const exportRows = items.map((r) => ({
    patient: r.patientName,
    doctor: r.doctorName,
    severity: r.severity,
    score: r.triageScore,
    status: r.status,
    date: r.createdAt,
  }));

  return (
    <AdminPageShell
      title="Triage reports"
      subtitle="All AI triage submissions"
      actions={<ExportButton data={exportRows} filename="admin-triage-export" />}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <option value="all">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Review">Under Review</option>
          <option value="Escalated">Escalated</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-slate-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-slate-400">No triage reports found.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="p-4 text-white">{r.patientName}</td>
                  <td className="p-4 text-slate-300">{r.doctorName ?? "—"}</td>
                  <td className="p-4 capitalize">{r.severity}</td>
                  <td className="p-4">{r.status}</td>
                  <td className="p-4 text-teal-400">{r.triageScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AdminPageShell>
  );
}
