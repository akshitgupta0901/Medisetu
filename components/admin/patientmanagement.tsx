"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authFetch } from "@/lib/fetch-auth";
import ExportButton from "@/components/admin/export-button";
import type { AdminPatientRow } from "@/types/admin";

function formatLastVisit(date?: string): string {
  if (!date) return "No visits yet";
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visit = new Date(d);
  visit.setHours(0, 0, 0, 0);
  const diff = Math.floor(
    (today.getTime() - visit.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString();
}

export default function PatientManagement() {
  const [patients, setPatients] = useState<AdminPatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminPatientRow | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      const res = await authFetch(`/api/admin/patients${params}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPatients(data.items);
      } else {
        setError(data.message ?? "Failed to load patients");
      }
    } catch {
      setError("Network error loading patients");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchPatients, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchPatients, search]);

  async function toggleSuspend(patient: AdminPatientRow) {
    setActionId(patient.userId);
    setError(null);
    try {
      const res = await authFetch(`/api/admin/users/${patient.userId}`, {
        method: "PATCH",
        body: JSON.stringify({ isSuspended: !patient.isSuspended }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to update patient");
        return;
      }
      setSelected(null);
      fetchPatients();
    } catch {
      setError("Network error");
    } finally {
      setActionId(null);
    }
  }

  const activeCount = patients.filter((p) => !p.isSuspended).length;

  return (
    <motion.section
      id="patients"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Patient Registry</h3>
          <p className="text-slate-400 text-sm mt-1">
            {loading
              ? "Loading..."
              : `${patients.length} patients · ${activeCount} active accounts`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 w-full sm:w-56"
          />
          <ExportButton
            data={patients.map((p) => ({
              name: p.name,
              email: p.email,
              bloodGroup: p.bloodGroup ?? "",
              appointments: p.appointmentCount,
              status: p.isSuspended ? "suspended" : "active",
            }))}
            filename="patients-export"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-400">No patients found.</p>
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
        <div className="space-y-3">
          {patients.map((patient) => (
            <div
              key={patient.userId}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:border-teal-500/25 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-11 w-11 rounded-full bg-blue-950/60 border border-blue-500/20 flex items-center justify-center shrink-0">
                  👤
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-white truncate">{patient.name}</h4>
                    {patient.isSuspended && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{patient.email}</p>
                  {patient.bloodGroup && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Blood group: {patient.bloodGroup}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 pl-[3.75rem] sm:pl-0">
                <div className="text-right text-sm">
                  <p className="text-slate-300">{patient.appointmentCount} visits</p>
                  <p className="text-xs text-slate-500">
                    Last: {formatLastVisit(patient.lastAppointmentDate)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(patient)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-sm transition shrink-0"
                >
                  View
                </button>
                <button
                  type="button"
                  disabled={actionId === patient.userId}
                  onClick={() => toggleSuspend(patient)}
                  className={`px-3 py-2 rounded-xl text-sm border transition shrink-0 disabled:opacity-50 ${
                    patient.isSuspended
                      ? "border-emerald-500/30 text-emerald-400"
                      : "border-red-500/30 text-red-400"
                  }`}
                >
                  {actionId === patient.userId
                    ? "..."
                    : patient.isSuspended
                      ? "Activate"
                      : "Suspend"}
                </button>
              </div>
            </div>
          ))}
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
                  <dt className="text-slate-500">User ID</dt>
                  <dd className="text-white font-mono text-xs">{selected.userId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Blood group</dt>
                  <dd className="text-white">{selected.bloodGroup ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="text-white">{selected.phone ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Appointments</dt>
                  <dd className="text-white">{selected.appointmentCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Last visit</dt>
                  <dd className="text-white">
                    {formatLastVisit(selected.lastAppointmentDate)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Account</dt>
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
