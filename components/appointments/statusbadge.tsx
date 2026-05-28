import type { AppointmentStatus } from "@/types/appointment";

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    Scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        styles[status] || "bg-slate-500/20 text-slate-300 border-slate-500/30"
      }`}
    >
      {status}
    </span>
  );
}
