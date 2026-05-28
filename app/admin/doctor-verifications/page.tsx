"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/admin/sidebar";
import TopBar from "@/components/admin/topbar";
import { authFetch } from "@/lib/fetch-auth";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function AdminDoctorVerificationsPage() {
  const [verifications, setVerifications] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `/api/admin/doctors/verifications?status=${filter}`
      );
      const data = await res.json();
      if (data.success) {
        setVerifications(data.verifications);
      } else {
        setError(data.message ?? "Failed to load verifications");
      }
    } catch {
      setError("Network error loading verifications");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleAction = async (id: string, status: "Approved" | "Rejected") => {
    if (status === "Rejected" && !rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      setSelectedId(id);
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const res = await authFetch(`/api/admin/doctors/verifications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, rejectionReason: rejectionReason.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchVerifications();
        setSelectedId(null);
        setRejectionReason("");
      } else {
        setError(data.message ?? "Action failed");
      }
    } catch {
      setError("Network error processing verification");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-64 pb-20 md:pb-0">
        <TopBar />

        <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Doctor Verifications
              </h1>
              <p className="text-slate-400">
                Review submitted profiles (v1.0 — no document uploads)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
              {["Pending", "Draft", "Approved", "Rejected", "All"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === f
                      ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-400" />
              <p>Loading verification requests...</p>
            </div>
          ) : verifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[32px]">
              <ShieldCheck className="w-16 h-16 text-slate-800 mb-4" />
              <h3 className="text-xl font-bold text-white mb-1">No requests found</h3>
              <p className="text-slate-500 max-w-xs">
                {filter === "Pending"
                  ? "No doctors have submitted for verification yet."
                  : `There are no ${filter.toLowerCase()} verification records.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {verifications.map((v) => {
                const user = v.userId as Record<string, unknown> | undefined;
                const id = String(v._id);
                return (
                  <div
                    key={id}
                    className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-teal-500/30 transition-all shadow-xl"
                  >
                    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 flex items-start gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-teal-400 border border-slate-700">
                          <User size={32} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">
                            {String(user?.name ?? "Unknown Doctor")}
                          </h3>
                          <p className="text-teal-500 text-sm font-medium">
                            {String(v.specialization ?? "—")}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-400 pt-2">
                            <p>
                              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                Qualification
                              </span>
                              <br />
                              {String(v.qualification || "—")}
                            </p>
                            <p>
                              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                Experience
                              </span>
                              <br />
                              {String(v.experience ?? 0)} years
                            </p>
                            <p>
                              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                Hospital
                              </span>
                              <br />
                              {String(v.hospital || "—")}
                            </p>
                            <p>
                              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                Phone
                              </span>
                              <br />
                              {String(v.phone || user?.email || "—")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-56 flex flex-col justify-center gap-3 shrink-0">
                        <div
                          className={`p-3 rounded-2xl border text-center text-xs font-bold uppercase tracking-widest ${
                            (v.verificationStatus || "Draft") === "Pending"
                              ? "border-yellow-500/30 text-yellow-400"
                              : (v.verificationStatus || "Draft") === "Approved"
                                ? "border-emerald-500/30 text-emerald-400"
                                : (v.verificationStatus || "Draft") === "Rejected"
                                  ? "border-red-500/30 text-red-400"
                                  : "border-slate-600 text-slate-400"
                          }`}
                        >
                          {String(v.verificationStatus || "Draft")}
                        </div>

                        {(v.verificationStatus || "Draft") === "Pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAction(id, "Approved")}
                              disabled={isProcessing}
                              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl transition flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={18} /> Approve
                            </button>
                            <input
                              placeholder="Rejection reason..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:border-red-500/50 outline-none"
                              value={selectedId === id ? rejectionReason : ""}
                              onChange={(e) => {
                                setSelectedId(id);
                                setRejectionReason(e.target.value);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleAction(id, "Rejected")}
                              disabled={isProcessing}
                              className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/5 font-bold rounded-2xl transition flex items-center justify-center gap-2"
                            >
                              <XCircle size={18} /> Reject
                            </button>
                          </>
                        ) : (v.verificationStatus || "Draft") === "Approved" ? (
                          <p className="text-[10px] text-emerald-500/80 text-center flex items-center justify-center gap-1">
                            <Clock size={12} />
                            {v.verifiedAt
                              ? `Approved ${new Date(String(v.verifiedAt)).toLocaleDateString()}`
                              : "Approved"}
                          </p>
                        ) : (v.verificationStatus || "Draft") === "Rejected" ? (
                          <p className="text-[10px] text-red-400/80 text-center">
                            {String(v.rejectionReason ?? "Rejected")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
