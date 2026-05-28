"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import { authFetch } from "@/lib/fetch-auth";
import AppointmentItem from "@/components/appointments/appointmentitem";
import type { SafeAppointment, AppointmentStatus } from "@/types/appointment";
import { Calendar, Loader2, Filter, Activity } from "lucide-react";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<SafeAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />
        <div className="p-4 md:p-6 lg:p-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="text-teal-500" size={32} />
                Manage Appointments
              </h1>
              <p className="text-slate-400">View and manage your upcoming and past consultations</p>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
              {[
                { id: "all", label: "All" },
                { id: "Scheduled", label: "Upcoming" },
                { id: "Completed", label: "Completed" },
                { id: "Cancelled", label: "Cancelled" },
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

          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 text-slate-500 bg-slate-900/20 border border-dashed border-slate-800 rounded-[32px]">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
                <p className="font-medium">Loading your schedule...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[32px]">
                <Activity className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">No Appointments Found</h3>
                <p className="text-slate-500 max-w-xs">You don't have any appointments matching this filter at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {appointments.map((appt) => (
                  <AppointmentItem
                    key={appt.id}
                    appointment={appt}
                    variant="doctor"
                    onStatusChange={handleStatusChange}
                    loadingId={loadingId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
