"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/patient/sidebar";
import TopBar from "@/components/patient/topbar";
import { authFetch } from "@/lib/fetch-auth";
import AppointmentItem from "@/components/appointments/appointmentitem";
import AppointmentBookingFlow from "@/components/patient/appointmentbookingflow";
import type { SafeAppointment, AppointmentStatus } from "@/types/appointment";
import { Activity, ArrowLeft, CalendarPlus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<SafeAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = filter === "all" ? "/api/appointments" : `/api/appointments?status=${filter}`;
      const res = await authFetch(url);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (isLoading || typeof window === "undefined" || !window.location.hash) {
      return;
    }

    const element = document.getElementById(window.location.hash.slice(1));
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [appointments, isLoading]);

  useEffect(() => {
    function syncRescheduleId() {
      setRescheduleId(new URLSearchParams(window.location.search).get("reschedule"));
    }

    syncRescheduleId();
    window.addEventListener("popstate", syncRescheduleId);
    return () => window.removeEventListener("popstate", syncRescheduleId);
  }, []);

  const handleBookingComplete = () => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/patient/appointments");
    }
    setRescheduleId(null);

    if (filter === "Scheduled") {
      fetchAppointments();
    } else {
      setFilter("Scheduled");
    }
  };

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    setLoadingId(id);
    try {
      const res = await authFetch(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((appt) => (appt.id === id ? data.appointment : appt))
        );
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-64 pb-20 md:pb-0">
        <TopBar />
        <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/patient" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium mb-4 transition-colors">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <CalendarPlus className="text-teal-500" size={32} />
                  Book Appointment
                </h1>
                <p className="text-slate-400">
                  Choose a verified doctor and schedule a consultation.
                </p>
              </div>
            </div>
          </div>

          <div id="booking-flow" className="scroll-mt-24">
            <AppointmentBookingFlow
              appointments={appointments}
              rescheduleId={rescheduleId}
              onComplete={handleBookingComplete}
            />
          </div>

          <section id="appointments-list" className="mt-8 scroll-mt-24">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
                  Upcoming Appointment
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  My Appointments
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                {[
                  { id: "all", label: "All" },
                  { id: "Scheduled", label: "Upcoming" },
                  { id: "Completed", label: "Completed" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filter === f.id
                        ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 text-slate-500 bg-slate-900/20 border border-dashed border-slate-800 rounded-[32px]">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
                <p className="font-medium">Retrieving your appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[32px]">
                <Activity className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">
                  You&apos;re all caught up.
                </h3>
                <p className="text-slate-400 max-w-sm">
                  Book your next consultation with a healthcare professional.
                </p>
                <Link
                  href="#booking-flow"
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-teal-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-200"
                >
                  Book Appointment
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    id={`appointment-${appt.id}`}
                    className="scroll-mt-24"
                  >
                    <AppointmentItem
                      appointment={appt}
                      variant="patient"
                      onStatusChange={appt.status === "Scheduled" ? handleStatusChange : undefined}
                      loadingId={loadingId}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
