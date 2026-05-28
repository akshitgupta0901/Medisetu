"use client";

import type { SafeAppointment, AppointmentStatus } from "@/types/appointment";
import StatusBadge from "./statusbadge";
import { Calendar, Clock, MapPin, Video, User, FileText } from "lucide-react";
import VerifiedBadge from "@/components/shared/verified-badge";

interface AppointmentItemProps {
  appointment: SafeAppointment;
  variant?: "patient" | "doctor" | "admin";
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
  loadingId?: string | null;
}

export default function AppointmentItem({
  appointment,
  variant = "patient",
  onStatusChange,
  loadingId,
}: AppointmentItemProps) {
  const isActionLoading = loadingId === appointment.id;
  const isPatient = variant === "patient";

  const displayName = isPatient
    ? appointment.doctor?.name ?? "Doctor"
    : appointment.patient?.name ?? "Patient";

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-teal-500/30 transition-all group shadow-lg">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-teal-400">
                <User size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors">
                    {displayName}
                  </h4>
                  {isPatient && appointment.doctorVerified && <VerifiedBadge size="sm" />}
                </div>
                <p className="text-xs text-slate-500">{isPatient ? "Consulting Doctor" : appointment.patient?.email}</p>
              </div>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
              <Calendar size={16} className="text-teal-500" />
              <span>{appointment.appointmentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
              <Clock size={16} className="text-teal-500" />
              <span>{appointment.appointmentTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
              {appointment.appointmentType === "Online" ? (
                <Video size={16} className="text-teal-500" />
              ) : (
                <MapPin size={16} className="text-teal-500" />
              )}
              <span>{appointment.appointmentType}</span>
            </div>
          </div>

          {(appointment.notes || appointment.reason) && (
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <FileText size={12} />
                <span>Notes / Reason</span>
              </div>
              <p className="text-sm text-slate-400 italic">
                &quot;{appointment.notes || appointment.reason}&quot;
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap md:flex-col gap-2 shrink-0 md:min-w-[140px]">
          {appointment.status === "Scheduled" && onStatusChange && (
            <>
              {/* Only show Mark Completed to doctors */}
              {variant === "doctor" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment.id, "Completed")}
                  disabled={!!isActionLoading}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/10"
                >
                  {isActionLoading ? "Processing..." : "Mark Completed"}
                </button>
              )}
              
              {/* Both can cancel */}
              <button
                type="button"
                onClick={() => onStatusChange(appointment.id, "Cancelled")}
                disabled={!!isActionLoading}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
