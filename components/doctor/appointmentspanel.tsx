"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment, AppointmentStatus } from "@/types/appointment";
import AppointmentItem from "@/components/appointments/appointmentitem";
import { isUpcomingAppointmentStatus } from "@/lib/appointments";

const FILTERS: { label: string; value: AppointmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function AppointmentsPanel() {
  const [appointments, setAppointments] = useState<SafeAppointment[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        filter === "all"
          ? "/api/appointments"
          : `/api/appointments?status=${filter}`;
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
  }, [filter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function handleStatusChange(id: string, status: string) {
    setActionId(id);
    setError(null);
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

  const scheduledCount = appointments.filter((a) =>
    isUpcomingAppointmentStatus(a.status)
  ).length;

  return (
    <section className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Assigned Appointments</h3>
          <p className="text-slate-400 text-sm mt-1">
            {scheduledCount} scheduled · {appointments.length} shown
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === f.value
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 border border-slate-800 hover:bg-slate-800"
              }`}
            >
              {f.label}
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
        <p className="text-slate-400 text-sm py-8 text-center">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-slate-400 text-sm py-8 text-center">
          No appointments in this category.
        </p>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {appointments.map((appt) => (
            <AppointmentItem
              key={appt._id}
              appointment={appt}
              variant="doctor"
              onStatusChange={handleStatusChange}
              loadingId={actionId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
