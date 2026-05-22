"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment, AppointmentStatus } from "@/types/appointment";
import AppointmentItem from "@/components/appointments/appointmentitem";

export default function AppointmentsPanel() {
  const [appointments, setAppointments] = useState<SafeAppointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        statusFilter === "all"
          ? "/api/appointments"
          : `/api/appointments?status=${statusFilter}`;
      const res = await authFetch(url);
      const data = await res.json();

      if (res.ok && data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.message ?? "Failed to load appointments");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function handleStatusChange(id: string, status: string) {
    setActionId(id);
    try {
      const res = await authFetch(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Update failed");
        return;
      }
      fetchAppointments();
    } catch {
      setError("Network error");
    } finally {
      setActionId(null);
    }
  }

  const stats = {
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  return (
    <section
      id="appointments"
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">All Appointments</h3>
          <p className="text-slate-400 text-sm mt-1">
            Hospital-wide scheduling overview
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-center">
          <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 px-4 py-2">
            <p className="text-lg font-bold text-amber-400">{stats.pending}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
          <div className="rounded-xl bg-teal-950/30 border border-teal-500/20 px-4 py-2">
            <p className="text-lg font-bold text-teal-400">{stats.approved}</p>
            <p className="text-xs text-slate-500">Approved</p>
          </div>
          <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/20 px-4 py-2">
            <p className="text-lg font-bold text-emerald-400">{stats.completed}</p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
        </div>
      </div>

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as AppointmentStatus | "all")
        }
        className="mb-4 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm py-8 text-center">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-slate-400 text-sm py-8 text-center">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <div className="space-y-3 min-w-[600px] max-h-[560px] overflow-y-auto pr-1">
            {appointments.map((appt) => (
              <AppointmentItem
                key={appt._id}
                appointment={appt}
                variant="admin"
                onStatusChange={handleStatusChange}
                loadingId={actionId}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
