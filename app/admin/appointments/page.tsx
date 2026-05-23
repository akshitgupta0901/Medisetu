"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageShell from "@/components/admin/admin-page-shell";
import ExportButton from "@/components/admin/export-button";
import AppointmentItem from "@/components/appointments/appointmentitem";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment, AppointmentStatus } from "@/types/appointment";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<SafeAppointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

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

  const exportRows = appointments.map((a) => ({
    id: a._id,
    patient: a.patient?.name ?? a.patientId,
    doctor: a.doctor?.name ?? a.doctorId,
    date: a.date,
    time: a.time,
    status: a.status,
    type: a.type,
    department: a.department,
  }));

  return (
    <AdminPageShell
      title="Appointments"
      subtitle="Manage all facility appointments"
      actions={<ExportButton data={exportRows} filename="appointments-export" />}
    >
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "completed", "cancelled"] as const).map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs border capitalize ${
                statusFilter === s
                  ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
        {loading ? (
          <p className="py-12 text-center text-slate-400 text-sm">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="py-12 text-center text-slate-400">No appointments found.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <AppointmentItem
                key={apt._id}
                appointment={apt}
                variant="admin"
                onStatusChange={handleStatusChange}
                loadingId={actionId}
              />
            ))}
          </div>
        )}
      </section>
    </AdminPageShell>
  );
}
