"use client";

import { useEffect, useState } from "react";
import GlassCard from "./glasscard";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment } from "@/types/appointment";
import StatusBadge from "@/components/appointments/statusbadge";

export default function AppointmentCard() {
  const [nextAppt, setNextAppt] = useState<SafeAppointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/appointments");
        const data = await res.json();
        if (res.ok && data.success) {
          const upcoming = data.appointments
            .filter(
              (a: SafeAppointment) =>
                a.status === "pending" || a.status === "approved"
            )
            .sort(
              (a: SafeAppointment, b: SafeAppointment) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
          setNextAppt(upcoming[0] ?? null);
        }
      } catch {
        /* keep static fallback */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <GlassCard className="md:col-span-5 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Your Next Appointment</h2>
        <p className="text-[#c5c6cd] text-sm">Loading...</p>
      </GlassCard>
    );
  }

  if (!nextAppt) {
    return (
      <GlassCard className="md:col-span-5 p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Your Next Appointment</h2>
        <p className="text-[#c5c6cd] text-sm mb-4">No upcoming visits scheduled.</p>
        <a
          href="#appointments"
          className="mt-auto bg-[#86db70] text-black py-4 rounded-xl font-bold text-center hover:shadow-[0_0_20px_rgba(134,219,112,0.3)] transition"
        >
          Book Appointment
        </a>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="md:col-span-5 p-8 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Your Next Appointment</h2>
        <StatusBadge status={nextAppt.status} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#86db70]/20 flex items-center justify-center text-2xl">
          👨‍⚕️
        </div>
        <div>
          <h3 className="font-bold text-lg">
            {nextAppt.doctor?.name ?? "Assigned Doctor"}
          </h3>
          <p className="text-[#86db70] text-sm">{nextAppt.department}</p>
        </div>
      </div>

      <div className="bg-[#1d2022] border border-[#1E5128] rounded-2xl p-5 mb-6">
        <p className="font-semibold">
          {nextAppt.date} at {nextAppt.time}
        </p>
        <p className="text-sm text-[#c5c6cd] mt-2 capitalize">
          {nextAppt.type.replace("-", " ")} · {nextAppt.reason}
        </p>
      </div>

      <a
        href="#appointments"
        className="mt-auto bg-[#86db70] text-black py-4 rounded-xl font-bold text-center hover:shadow-[0_0_20px_rgba(134,219,112,0.3)] transition"
      >
        Manage Appointments
      </a>
    </GlassCard>
  );
}
