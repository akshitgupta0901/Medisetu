"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import { authFetch } from "@/lib/fetch-auth";
import type { TriageReportRow } from "@/types/triage";
import {
  Brain,
  Calendar,
  Activity,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function DoctorAiReportsPage() {
  const [reports, setReports] = useState<TriageReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<TriageReportRow | null>(null);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("10:00");

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params =
        severityFilter !== "all" ? `?severity=${severityFilter}` : "";
      const res = await authFetch(`/api/doctors/ai-reports${params}`);
      const data = await res.json();
      if (data.success) setReports(data.reports);
      else setError(data.message ?? "Failed to load reports");
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }, [severityFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    if (selectedReport) setDoctorNotes(selectedReport.doctorNotes ?? "");
  }, [selectedReport]);

  async function handleSaveNotes() {
    if (!selectedReport) return;
    setSaving(true);
    try {
      const res = await authFetch("/api/doctors/ai-reports", {
        method: "PATCH",
        body: JSON.stringify({
          reportId: selectedReport.id,
          doctorNotes,
          status: "Under Review",
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchReports();
        setSelectedReport(data.report);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAppointment() {
    if (!selectedReport || !apptDate) return;
    setSaving(true);
    try {
      const res = await authFetch(
        `/api/triage/${selectedReport.id}/appointment`,
        {
          method: "POST",
          body: JSON.stringify({ date: apptDate, time: apptTime }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Appointment created for patient");
        fetchReports();
      } else {
        alert(data.message ?? "Failed to create appointment");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleStartConsultation() {
    if (!selectedReport?.doctorId) return;
    setSaving(true);
    try {
      const res = await authFetch("/api/live-consultations", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedReport.patientId,
          doctorId: selectedReport.doctorId,
          triageReportId: selectedReport.id,
          reason: `Triage follow-up: ${selectedReport.symptoms.slice(0, 80)}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/telehealth/${data.consultation.id}`;
      }
    } finally {
      setSaving(false);
    }
  }

  const getSeverityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "moderate":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />
        <div className="p-4 md:p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">AI Triage Reports</h1>
              <p className="text-slate-400 mt-2">
                Assigned triage reports from your patients
              </p>
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
            >
              <option value="all">All severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1 space-y-4">
              {isLoading ? (
                <div className="flex justify-center p-20">
                  <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
                </div>
              ) : reports.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
                  <Brain className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-white">No triage reports</p>
                  <p className="text-slate-400 mt-2">
                    Reports appear when patients submit AI triage assessments.
                  </p>
                </div>
              ) : (
                reports.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-6 rounded-3xl border transition ${
                      selectedReport?.id === report.id
                        ? "bg-teal-500/10 border-teal-500/50"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase border mb-3 ${getSeverityColor(report.severity)}`}
                    >
                      {report.severity}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {report.patientName ?? "Patient"}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">{report.status}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Score: {report.triageScore}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{report.symptoms}</p>
                  </button>
                ))
              )}
            </div>

            <div className="xl:col-span-2">
              {selectedReport ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="p-8 border-b border-slate-800 flex flex-wrap justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Clinical Analysis</h2>
                      <p className="text-slate-400 text-sm">
                        {selectedReport.patientName} · {selectedReport.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleStartConsultation}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl border border-teal-500/30 text-teal-300 text-sm"
                      >
                        Start consultation
                      </button>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <section>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">
                        Symptoms
                      </h4>
                      <p className="text-slate-300 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        {selectedReport.symptoms}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">
                        Doctor notes
                      </h4>
                      <textarea
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        disabled={saving}
                        className="mt-2 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-sm font-semibold"
                      >
                        Save notes
                      </button>
                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={apptDate}
                        onChange={(e) => setApptDate(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white"
                      />
                      <input
                        type="time"
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={handleCreateAppointment}
                        disabled={saving || !apptDate}
                        className="sm:col-span-2 py-2 rounded-xl border border-teal-500/30 text-teal-300 text-sm"
                      >
                        Convert to appointment
                      </button>
                    </section>

                    <p className="text-sm text-slate-400">{selectedReport.analysis.summary}</p>

                    <div className="flex gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-xs text-slate-500">{selectedReport.analysis.disclaimer}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-slate-500">
                  <Brain className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a report to review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
