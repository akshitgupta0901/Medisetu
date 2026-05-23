"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";
import { exportData } from "@/lib/export-data";
import type { TriageReportRow } from "@/types/triage";

export default function PatientTriageHistory() {
  const [reports, setReports] = useState<TriageReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TriageReportRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/triage");
      const data = await res.json();
      if (res.ok && data.success) setReports(data.reports);
      else setError(data.message ?? "Failed to load reports");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function downloadReport(report: TriageReportRow, format: "json" | "csv") {
    exportData(
      format,
      [
        {
          id: report.id,
          symptoms: report.symptoms,
          severity: report.severity,
          riskLevel: report.riskLevel,
          score: report.triageScore,
          status: report.status,
          recommendations: report.recommendations.join(" | "),
          createdAt: report.createdAt,
        },
      ],
      `triage-report-${report.id}`
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm py-8 text-center">Loading your triage reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-slate-400 text-sm py-8 text-center">
          No triage reports yet. Submit symptoms via the AI checker.
        </p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="text-white font-medium capitalize">
                  {r.severity} · Score {r.triageScore}
                </p>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{r.symptoms}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {r.status} · {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelected(r)}
                  className="px-3 py-2 rounded-lg text-xs border border-slate-700 text-teal-300"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => downloadReport(r, "json")}
                  className="px-3 py-2 rounded-lg text-xs border border-slate-700 text-slate-300"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Triage report</h3>
            <p className="text-sm text-slate-400 mt-1 capitalize">
              {selected.severity} · {selected.status}
            </p>
            <p className="mt-4 text-sm text-slate-300">{selected.symptoms}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400 list-disc pl-5">
              {selected.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => downloadReport(selected, "json")}
                className="flex-1 py-2 rounded-xl bg-teal-500 text-slate-950 text-sm font-semibold"
              >
                Download JSON
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
