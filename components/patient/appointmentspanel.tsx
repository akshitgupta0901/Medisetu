"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import GlassCard from "./glasscard";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment } from "@/types/appointment";
import type { SafeUser } from "@/types/auth";
import AppointmentItem from "@/components/appointments/appointmentitem";
import type { AppointmentStatus } from "@/types/appointment";
import {
  getMinBookingDateString,
  getMaxBookingDateString,
  isUpcomingAppointmentStatus,
  mapBookingTypeToAppointmentType,
} from "@/lib/appointments";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function AppointmentsPanel() {
  const [appointments, setAppointments] = useState<SafeAppointment[]>([]);
  const [doctors, setDoctors] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [department, setDepartment] = useState("General");
  const [type, setType] = useState<"in-person" | "telehealth">("telehealth");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [apptRes, docRes] = await Promise.all([
        authFetch("/api/appointments"),
        authFetch("/api/doctors"),
      ]);

      const apptData = await apptRes.json();
      const docData = await docRes.json();

      if (apptRes.ok && apptData.success) {
        setAppointments(apptData.appointments);
      } else {
        setError(apptData.message ?? "Failed to load appointments");
      }

      if (docRes.ok && docData.success) {
        setDoctors(docData.doctors);
        setDoctorId((prev) => prev || docData.doctors[0]?._id || "");
      }
    } catch {
      setError("Network error loading appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorId,
          appointmentDate: date,
          appointmentTime: time,
          appointmentType: mapBookingTypeToAppointmentType(type),
          reason: reason.trim(),
          department: department.trim() || "General",
          notes: reason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Booking failed");
        return;
      }

      setSuccess(data.message ?? "Appointment booked!");
      setShowForm(false);
      setReason("");
      setDate("");
      setTime("");
      fetchData();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    setActionId(id);
    setError(null);
    try {
      const res = await authFetch(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Cancel failed");
        return;
      }
      fetchData();
    } catch {
      setError("Network error");
    } finally {
      setActionId(null);
    }
  }

  const upcoming = appointments.filter((a) => isUpcomingAppointmentStatus(a.status));

  return (
    <GlassCard className="md:col-span-12 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-teal-400" size={24} />
            My Appointments
          </h2>
          <p className="text-sm text-teal-300/80 mt-1">
            {upcoming.length} upcoming · {appointments.length} total
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Link
            href="/patient/appointments"
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition text-sm text-center"
          >
            View All
          </Link>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-teal-300 text-slate-950 font-bold shadow-lg shadow-teal-500/15 hover:bg-teal-200 hover:shadow-teal-400/25 transition text-sm"
          >
            {showForm ? "Close" : "+ Book Appointment"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-slate-800 bg-teal-400/10 px-4 py-3 text-sm text-teal-300">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-5"
        >
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 uppercase">Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            >
              {doctors.length === 0 ? (
                <option value="">No verified doctors available</option>
              ) : (
                doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={getMinBookingDateString()}
              max={getMaxBookingDateString()}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
            <p className="mt-1 text-xs text-slate-500">
              Book up to 60 days in advance
            </p>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Type</label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "in-person" | "telehealth")
              }
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
            >
              <option value="telehealth">Online / Telehealth</option>
              <option value="in-person">In-person</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 uppercase">
              Reason for visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={2}
              placeholder="Describe your symptoms or reason..."
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting || doctors.length === 0}
              className="w-full py-3 rounded-xl bg-teal-300 text-slate-950 font-bold shadow-lg shadow-teal-500/15 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <p className="text-slate-400 text-sm animate-pulse">
            Loading your schedule...
          </p>
        </div>
      ) : upcoming.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <p className="text-base font-semibold text-white">
            You&apos;re all caught up.
          </p>
          <p className="mt-2 text-slate-400 text-sm">
            Book your next consultation with a healthcare professional.
          </p>
          <Link
            href="/patient/appointments"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-300 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-200"
          >
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {upcoming.slice(0, 3).map((appt) => (
            <AppointmentItem
              key={appt.id}
              appointment={appt}
              variant="patient"
              onStatusChange={handleStatusChange}
              loadingId={actionId}
            />
          ))}
          {upcoming.length > 3 && (
            <Link
              href="/patient/appointments"
              className="block text-center py-2 text-xs text-teal-400 hover:underline"
            >
              Show {upcoming.length - 3} more upcoming appointments
            </Link>
          )}
        </div>
      )}
    </GlassCard>
  );
}
