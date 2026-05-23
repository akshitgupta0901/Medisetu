"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authFetch } from "@/lib/fetch-auth";
import ExportButton from "@/components/admin/export-button";
import type { AdminDoctorRow } from "@/types/admin";

function statusLabel(doc: AdminDoctorRow): { text: string; className: string } {
  if (doc.isSuspended) {
    return {
      text: "Suspended",
      className: "text-red-400 bg-red-500/10 border-red-500/20",
    };
  }
  if (doc.todayAppointments > 10) {
    return {
      text: "High Load",
      className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    };
  }
  if (doc.todayAppointments > 0) {
    return {
      text: "Active",
      className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
  }
  return {
    text: "Available",
    className: "text-slate-400 bg-slate-800/50 border-slate-700",
  };
}

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<AdminDoctorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminDoctorRow | null>(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      const res = await authFetch(`/api/admin/doctors${params}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setDoctors(data.items);
      } else {
        setError(data.message ?? "Failed to load doctors");
      }
    } catch {
      setError("Network error loading doctors");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchDoctors, search]);

  async function toggleSuspend(doc: AdminDoctorRow) {
    setActionId(doc.userId);
    setError(null);
    try {
      const res = await authFetch(`/api/admin/users/${doc.userId}`, {
        method: "PATCH",
        body: JSON.stringify({ isSuspended: !doc.isSuspended }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to update doctor");
        return;
      }
      setSelected(null);
      fetchDoctors();
    } catch {
      setError("Network error");
    } finally {
      setActionId(null);
    }
  }

  const activeCount = doctors.filter((d) => !d.isSuspended).length;
  const suspendedCount = doctors.filter((d) => d.isSuspended).length;

  return (
    <motion.section
      id="doctors"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Physician Management</h3>
          <p className="text-slate-400 text-sm mt-1">
            {loading
              ? "Loading..."
              : `${doctors.length} physicians · ${activeCount} active · ${suspendedCount} suspended`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 w-full sm:w-56"
          />
          <ExportButton
            data={doctors.map((d) => ({
              name: d.name,
              email: d.email,
              specialization: d.specialization,
              patients: d.patientCount,
              appointments: d.appointmentCount,
              status: d.isSuspended ? "suspended" : "active",
            }))}
            filename="doctors-export"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading physicians...</div>
      ) : doctors.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-400">No doctors found.</p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-2 text-sm text-teal-400 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="pb-3 pr-4 font-medium">Physician</th>
                <th className="pb-3 pr-4 font-medium">Specialty</th>
                <th className="pb-3 pr-4 font-medium">Panel</th>
                <th className="pb-3 pr-4 font-medium">Today</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {doctors.map((doc) => {
                const status = statusLabel(doc);
                return (
                  <tr key={doc.userId} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-teal-500/15 flex items-center justify-center shrink-0">
                          👨‍⚕️
                        </div>
                        <div>
                          <p className="font-medium text-white">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-400">{doc.specialization}</td>
                    <td className="py-4 pr-4 text-slate-300">{doc.patientCount}</td>
                    <td className="py-4 pr-4 text-teal-400 font-medium">
                      {doc.todayAppointments}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(doc)}
                          className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-teal-300 hover:bg-slate-700"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          disabled={actionId === doc.userId}
                          onClick={() => toggleSuspend(doc)}
                          className={`px-3 py-1.5 rounded-lg text-xs border disabled:opacity-50 ${
                            doc.isSuspended
                              ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          {actionId === doc.userId
                            ? "..."
                            : doc.isSuspended
                              ? "Activate"
                              : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
            >
              <h4 className="text-lg font-bold text-white">{selected.name}</h4>
              <p className="text-sm text-slate-400 mt-1">{selected.email}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Specialization</dt>
                  <dd className="text-white">{selected.specialization}</dd>
                </div>
                {selected.qualification && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Qualification</dt>
                    <dd className="text-white">{selected.qualification}</dd>
                  </div>
                )}
                {selected.hospital && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Hospital</dt>
                    <dd className="text-white">{selected.hospital}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">Total appointments</dt>
                  <dd className="text-white">{selected.appointmentCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Account status</dt>
                  <dd className={selected.isSuspended ? "text-red-400" : "text-emerald-400"}>
                    {selected.isSuspended ? "Suspended" : "Active"}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => toggleSuspend(selected)}
                  disabled={actionId === selected.userId}
                  className="flex-1 py-2 rounded-xl bg-teal-500 text-slate-950 font-semibold text-sm disabled:opacity-50"
                >
                  {selected.isSuspended ? "Activate account" : "Suspend account"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
