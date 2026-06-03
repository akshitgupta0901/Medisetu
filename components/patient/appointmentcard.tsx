"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CalendarPlus, Eye, RotateCcw, XCircle } from "lucide-react";
import GlassCard from "./glasscard";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment } from "@/types/appointment";
import {
  isUpcomingAppointmentStatus,
  formatAppointmentTypeLabel,
} from "@/lib/appointments";
import StatusBadge from "@/components/appointments/statusbadge";

function sortByDate(a: SafeAppointment, b: SafeAppointment) {
  const aTime = new Date(a.appointmentDate || a.date).getTime();
  const bTime = new Date(b.appointmentDate || b.date).getTime();
  return aTime - bTime;
}

export default function AppointmentCard() {
  const [nextAppt, setNextAppt] = useState<SafeAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNextAppointment = useCallback(async () => {
    setError(null);
    try {
      const res = await authFetch("/api/appointments");
      const data = await res.json();
      if (res.ok && data.success) {
        const upcoming = data.appointments
          .filter((a: SafeAppointment) => isUpcomingAppointmentStatus(a.status))
          .sort(sortByDate);
        setNextAppt(upcoming[0] ?? null);
      } else {
        setError(data.message ?? "Unable to load upcoming appointment");
      }
    } catch {
      setError("Network error loading upcoming appointment");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNextAppointment();
  }, [loadNextAppointment]);

  async function cancelAppointment() {
    if (!nextAppt) return;

    setActionLoading(true);
    setError(null);

    try {
      const res = await authFetch(`/api/appointments/${nextAppt.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Unable to cancel appointment");
        return;
      }

      await loadNextAppointment();
    } catch {
      setError("Network error cancelling appointment");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <GlassCard className="h-full p-5 md:p-6 flex flex-col justify-center text-center border-dashed">
        <h2 className="text-xl font-bold mb-2">Upcoming Visit</h2>
        <p className="text-slate-400 text-sm">Loading...</p>
      </GlassCard>
    );
  }

  if (!nextAppt) {
    return (
      <GlassCard className="h-full p-5 md:p-6 flex flex-col border-dashed">
        <h2 className="text-xl font-bold text-white">Upcoming Visit</h2>
        <div className="mt-5 flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-center">
          <p className="text-lg font-semibold text-white">You&apos;re all caught up.</p>
          <p className="mt-2 text-sm font-medium text-slate-300">
            No upcoming appointments
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Book your next consultation with a healthcare professional.
          </p>
        </div>
        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
        <Link
          href="/patient/appointments"
          className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-300 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <CalendarPlus size={17} />
          Book Appointment
        </Link>
      </GlassCard>
    );
  }

  const displayDate = nextAppt.appointmentDate || nextAppt.date;
  const displayTime = nextAppt.appointmentTime || nextAppt.time;
  const displayType = formatAppointmentTypeLabel(
    nextAppt.appointmentType || nextAppt.type
  );

  return (
    <GlassCard className="h-full p-5 md:p-6 flex flex-col transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">Upcoming Visit</h2>
        <StatusBadge status={nextAppt.status} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-teal-400/20 flex items-center justify-center text-xl">
          👨‍⚕️
        </div>
        <div>
          <h3 className="font-bold text-sm">
            {nextAppt.doctor?.name ?? "Assigned Doctor"}
          </h3>
          <p className="text-teal-300 text-sm">{nextAppt.department}</p>
        </div>
      </div>

      <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-4 flex-1">
        <p className="font-semibold text-sm">
          {displayDate} at {displayTime}
        </p>
        <p className="text-xs text-slate-400 mt-1 capitalize">
          {displayType}
          {nextAppt.reason ? ` · ${nextAppt.reason}` : ""}
        </p>
      </div>

      {error && <p className="mb-3 text-xs text-red-300">{error}</p>}

      <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Link
          href={`/patient/appointments#appointment-${nextAppt.id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-bold text-slate-100 transition hover:border-teal-400/50 hover:text-teal-200"
        >
          <Eye size={15} />
          View Details
        </Link>
        <Link
          href={`/patient/appointments?reschedule=${nextAppt.id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-300 px-3 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-200"
        >
          <RotateCcw size={15} />
          Reschedule
        </Link>
        <button
          type="button"
          onClick={cancelAppointment}
          disabled={actionLoading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <XCircle size={15} />
          {actionLoading ? "Cancelling..." : "Cancel"}
        </button>
      </div>
    </GlassCard>
  );
}
