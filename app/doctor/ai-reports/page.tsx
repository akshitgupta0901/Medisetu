"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import { authFetch } from "@/lib/fetch-auth";
import CreateAppointmentModal from "@/components/doctor/create-appointment-modal";
import {
  Brain,
  Calendar,
  Activity,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Save,
  PlayCircle,
  ChevronRight,
  Stethoscope,
  PlusCircle
} from "lucide-react";

export default function DoctorAiReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  // Debug log for reports data
  useEffect(() => {
    if (reports.length > 0) {
      console.log("REPORTS LOADED:", reports);
    }
  }, [reports]);

  // Debug log for selection
  useEffect(() => {
    if (selectedReport) {
      console.log("REPORT SELECTED:", selectedReport);
    }
  }, [selectedReport]);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch("/api/doctors/ai-reports");
      const data = await res.json();
      if (data.success) {
        // Use the exact deduplicated merge pattern requested
        setReports(prev => {
          const merged = [...prev, ...data.reports];
          const unique = Array.from(
            new Map(
              merged.map(r => [(r.id || r._id), r])
            ).values()
          );
          return unique;
        });
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpdate = async (updateData: any) => {
    if (!selectedReport) return;
    
    setSaving(true);
    try {
      const res = await authFetch("/api/doctors/ai-reports", {
        method: "PATCH",
        body: JSON.stringify({
          reportId: selectedReport.id || selectedReport._id,
          ...updateData,
        }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        if (updated.success) {
          const updatedReport = updated.report;
          // Ensure we replace instead of append as requested
          setReports(prev =>
            prev.map(r =>
              (r.id || r._id) === (updatedReport.id || updatedReport._id)
                ? updatedReport
                : r
            )
          );
          setSelectedReport(updatedReport);
        }
      }
    } catch (error) {
      console.error("Failed to update report:", error);
    } finally {
      setSaving(false);
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "moderate": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Under Review": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Escalated": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  console.log("REPORT IDS", reports.map(r => r.id || r._id));

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />
        <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Clinical Triage Reports</h1>
              <p className="text-slate-400">Review and manage AI-generated patient assessments</p>
            </div>
            <button 
              onClick={fetchReports}
              className="p-2 hover:bg-slate-900 rounded-full transition text-slate-400"
              title="Refresh Reports"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Reports List */}
            <div className="xl:col-span-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading && reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p>Loading reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="p-10 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl">
                  No triage reports found.
                </div>
              ) : (
                reports.map((report) => {
                  const reportId = report.id || report._id;
                  const isSelected = selectedReport && (selectedReport.id === reportId || selectedReport._id === reportId);
                  
                  return (
                    <button
                      key={reportId}
                      onClick={() => { 
                        setSelectedReport(report); 
                        setDoctorNotes(report.doctorNotes || ""); 
                      }}
                      className={`w-full text-left p-5 rounded-3xl border transition-all duration-200 group ${
                        isSelected 
                          ? "bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/20" 
                          : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSeverityColor(report.analysis?.severityLevel || report.severity)}`}>
                          {report.analysis?.severityLevel || report.severity}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(report.status)}`}>
                            {report.status}
                          </span>
                          {report.status === "Completed" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                        {report.patientName || report.patientId?.name || "Unknown Patient"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-3">
                        <Stethoscope className="w-3 h-3" />
                        <span>{report.analysis?.recommendedSpecialist || "General Consultation"}</span>
                      </div>
                      
                      <p className="text-sm text-slate-400 line-clamp-2 italic">
                        "{report.symptoms}"
                      </p>
                      
                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-800/50">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Just now"}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "translate-x-1 text-teal-400" : "text-slate-600 group-hover:translate-x-1"}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Report Detail Panel */}
            <div className="xl:col-span-8">
              {selectedReport ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-white">Clinical Assessment</h2>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSeverityColor(selectedReport.analysis?.severityLevel || selectedReport.severity)}`}>
                            {selectedReport.analysis?.severityLevel || selectedReport.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Patient: <span className="text-white font-medium">{selectedReport.patientName || selectedReport.patientId?.name || "Unknown"}</span>
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          disabled={saving}
                          onClick={() => handleUpdate({ status: "Under Review" })} 
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors"
                        >
                          Mark Under Review
                        </button>
                        <button 
                          disabled={saving}
                          onClick={() => handleUpdate({ status: "Completed" })} 
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-900/20"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark Completed"}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-350px)] custom-scrollbar">
                    {appointmentSuccess && (
                      <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400 text-sm font-medium flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <CheckCircle size={18} />
                        <span>Appointment scheduled successfully!</span>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Severity Level</p>
                        <p className={`text-sm font-bold capitalize ${getSeverityColor(selectedReport.analysis?.severityLevel || selectedReport.severity).split(' ')[0]}`}>
                          {selectedReport.analysis?.severityLevel || selectedReport.severity}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Urgency Score</p>
                        <div className="flex items-end gap-1">
                          <p className="text-xl font-bold text-teal-400">{selectedReport.analysis?.urgencyScore || selectedReport.triageScore || 0}</p>
                          <p className="text-[10px] text-slate-600 mb-1">/100</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Status</p>
                        <p className="text-sm font-bold text-white">{selectedReport.status}</p>
                      </div>
                      <button 
                        onClick={() => setIsAppointmentModalOpen(true)}
                        className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl hover:bg-teal-500/20 transition-all group flex flex-col items-center justify-center gap-1"
                      >
                        <PlusCircle size={20} className="text-teal-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Schedule Appt</span>
                      </button>
                    </div>

                    {/* Symptoms */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Symptoms</h3>
                      </div>
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 italic text-slate-300">
                        "{selectedReport.symptoms}"
                      </div>
                    </section>

                    {/* Possible Conditions */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Diagnoses (AI)</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(selectedReport.analysis?.possibleConditions || []).map((c: any, i: number) => (
                          <div
                            key={`${c.name}-${i}`}
                            className="flex flex-col p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-white">{c.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                c.likelihood?.toLowerCase() === 'high' ? 'text-orange-400 bg-orange-400/10' : 
                                c.likelihood?.toLowerCase() === 'moderate' ? 'text-yellow-400 bg-yellow-400/10' : 'text-teal-400 bg-teal-400/10'
                              }`}>
                                {c.likelihood}
                              </span>
                            </div>
                            {c.description && <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Care Advice */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <PlayCircle className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommendations</h3>
                      </div>
                      <div className="p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl text-sm text-slate-300 leading-relaxed">
                        {selectedReport.analysis?.careAdvice || selectedReport.recommendations?.join(". ")}
                      </div>
                    </section>

                    {/* Doctor Notes */}
                    <section className="pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Save className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Observations & Notes</h3>
                      </div>
                      <textarea 
                        value={doctorNotes} 
                        onChange={(e) => setDoctorNotes(e.target.value)} 
                        placeholder="Add your clinical observations here..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 rounded-2xl p-4 text-sm outline-none transition-all min-h-[120px] resize-none" 
                      />
                      <div className="mt-3 flex justify-end">
                        <button 
                          disabled={saving}
                          onClick={() => handleUpdate({ doctorNotes })} 
                          className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs transition-all"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
                          Save Clinical Notes
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-[3xl] bg-slate-900/20 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                    <Brain className="w-10 h-10 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Report Selected</h3>
                  <p className="max-w-xs mx-auto">Select a clinical triage report from the list on the left to review the full details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 212, 191, 0.3);
        }
      `}</style>

      {isAppointmentModalOpen && selectedReport && (
        <CreateAppointmentModal
          report={selectedReport}
          onClose={() => setIsAppointmentModalOpen(false)}
          onSuccess={() => {
            setAppointmentSuccess(true);
            setTimeout(() => setAppointmentSuccess(false), 5000);
          }}
        />
      )}
    </main>
  );
}
