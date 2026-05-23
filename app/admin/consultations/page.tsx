"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminPageShell from "@/components/admin/admin-page-shell";
import ExportButton from "@/components/admin/export-button";
import { authFetch } from "@/lib/fetch-auth";
import type { AdminConsultationRow } from "@/types/admin";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminConsultationsPage() {
  const [items, setItems] = useState<AdminConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState<AdminConsultationRow | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (patientSearch.trim()) params.set("patient", patientSearch.trim());
      if (doctorSearch.trim()) params.set("doctor", doctorSearch.trim());
      if (status !== "all") params.set("status", status);

      const res = await authFetch(`/api/admin/consultations?${params}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.items);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message ?? "Failed to load consultations");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [patientSearch, doctorSearch, status, page]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const exportRows = items.map((c) => ({
    id: c.id,
    patient: c.patientName,
    doctor: c.doctorName,
    status: c.status,
    type: c.type,
    reason: c.reason,
    date: c.consultationDate.split("T")[0],
  }));

  return (
    <AdminPageShell
      title="Consultations"
      subtitle="Clinical sessions synced from appointments"
      actions={
        <ExportButton data={exportRows} filename="consultations-export" />
      }
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="search"
          placeholder="Search patient..."
          value={patientSearch}
          onChange={(e) => {
            setPage(1);
            setPatientSearch(e.target.value);
          }}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        />
        <input
          type="search"
          placeholder="Search doctor..."
          value={doctorSearch}
          onChange={(e) => {
            setPage(1);
            setDoctorSearch(e.target.value);
          }}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-slate-400 text-sm">Loading consultations...</p>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-slate-400">No consultations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/30">
                    <td className="p-4">
                      <p className="text-white font-medium">{row.patientName}</p>
                      <p className="text-xs text-slate-500">{row.patientEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{row.doctorName}</p>
                      <p className="text-xs text-slate-500">{row.doctorEmail}</p>
                    </td>
                    <td className="p-4 text-slate-300">
                      {new Date(row.consultationDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-400 capitalize">{row.type}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-lg border border-slate-700 text-slate-300 capitalize">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="text-teal-400 text-xs hover:underline"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm disabled:opacity-40"
          >
            Next
          </button>
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
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-lg font-bold text-white">Consultation details</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Patient</dt>
                  <dd className="text-white">{selected.patientName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Doctor</dt>
                  <dd className="text-white">{selected.doctorName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Reason</dt>
                  <dd className="text-white text-right max-w-[60%]">{selected.reason}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="text-white capitalize">{selected.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="text-white capitalize">{selected.type}</dd>
                </div>
                {selected.notes && (
                  <div>
                    <dt className="text-slate-500 mb-1">Notes</dt>
                    <dd className="text-slate-300">{selected.notes}</dd>
                  </div>
                )}
              </dl>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-6 w-full py-2 rounded-xl border border-slate-700 text-slate-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminPageShell>
  );
}
