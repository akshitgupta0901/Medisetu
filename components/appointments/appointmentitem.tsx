"use client";

import { useRouter } from "next/navigation";
import type { SafeAppointment } from "@/types/appointment";
import StatusBadge from "./statusbadge";

interface AppointmentItemProps {
  appointment: SafeAppointment;
  variant?: "patient" | "doctor" | "admin";
  onStatusChange?: (id: string, status: string) => void;
  onCancel?: (id: string) => void;
  loadingId?: string | null;
}

export default function AppointmentItem({
  appointment,
  variant = "patient",
  onStatusChange,
  onCancel,
  loadingId,
}: AppointmentItemProps) {
  const router = useRouter();
  const isLoading = loadingId === appointment._id;
  const isPatient = variant === "patient";
  const isDoctor = variant === "doctor";
  const isAdmin = variant === "admin";

  const displayName = isPatient
    ? appointment.doctor?.name ?? "Doctor"
    : appointment.patient?.name ?? "Patient";

  const subLabel = isPatient
    ? appointment.department
    : appointment.patient?.email ?? "";

  const startConsultation = async () => {
    try {
      const res = await fetch("/api/live-consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: appointment.doctorId,
          patientId: appointment.patientId,
          appointmentId: appointment._id,
          reason: appointment.reason,
        }),
      });
      if (res.ok) {
        router.push("/telehealth");
      }
    } catch (e) {
      console.error("Failed to start consultation:", e);
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        variant === "patient"
          ? "border-[#1E5128] bg-[#1d2022]/80 hover:border-[#86db70]/40"
          : "border-slate-800 bg-slate-950/50 hover:border-teal-500/25"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-white truncate">{displayName}</h4>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-sm text-slate-400 truncate">{subLabel}</p>
          <p className="text-sm text-slate-300 mt-2">
            {appointment.date} at {appointment.time}
          </p>
          <p className="text-xs text-slate-500 mt-1 capitalize">
            {appointment.type.replace("-", " ")} · {appointment.reason}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {isPatient && appointment.status === "pending" && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(appointment._id)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-400 disabled:opacity-50"
            >
              {isLoading ? "..." : "Cancel"}
            </button>
          )}

          {(isDoctor || isAdmin) && onStatusChange && (
            <>
              {appointment.status === "approved" && (
                <button
                  type="button"
                  onClick={startConsultation}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                >
                  Start Consultation
                </button>
              )}
              {appointment.status === "pending" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment._id, "approved")}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-300 text-slate-950 hover:bg-teal-200 disabled:opacity-50"
                >
                  Approve
                </button>
              )}
              {appointment.status === "approved" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment._id, "completed")}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-300 text-slate-950 hover:bg-emerald-200 disabled:opacity-50"
                >
                  Complete
                </button>
              )}
              {["pending", "approved"].includes(appointment.status) && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment._id, "cancelled")}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-400/60 bg-red-500/10 text-red-100 hover:bg-red-500/20 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
