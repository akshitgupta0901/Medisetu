import type { AppointmentStatus } from "@/types/appointment";

const styles: Record<AppointmentStatus, string> = {
  pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  approved: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-slate-400 bg-slate-800/50 border-slate-700",
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
