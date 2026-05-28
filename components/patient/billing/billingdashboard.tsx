"use client";

import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/lib/fetch-auth";
import GlassCard from "@/components/patient/glasscard";
import {
  Loader2,
  Receipt,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  User,
  Stethoscope,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BillItem {
  id: string;
  invoiceNumber: string;
  appointmentId: string;
  doctorName: string;
  doctorEmail: string;
  specialization: string;
  consultationFee: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  appointmentStatus: string;
  department: string;
  amount: number;
  status: "paid" | "pending" | "cancelled";
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface BillingSummary {
  totalBilled: number;
  totalPaid: number;
  totalPending: number;
  count: number;
}

type FilterStatus = "all" | "paid" | "pending" | "cancelled";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; border: string; label: string }> = {
    paid: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      label: "Paid",
    },
    pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      label: "Pending",
    },
    cancelled: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      label: "Cancelled",
    },
  };

  const c = config[status] ?? config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}
    >
      {status === "paid" && <CheckCircle2 className="w-3 h-3" />}
      {status === "pending" && <Clock className="w-3 h-3" />}
      {status === "cancelled" && <XCircle className="w-3 h-3" />}
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary Card                                                       */
/* ------------------------------------------------------------------ */

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <GlassCard className="p-5 md:p-6 flex items-start gap-4 hover:border-slate-700 transition-colors">
      <div
        className={`p-3 rounded-2xl ${accent}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
          {label}
        </p>
        <p className="text-xl font-bold text-white mt-1">{value}</p>
      </div>
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Bill Detail Modal                                                  */
/* ------------------------------------------------------------------ */

function BillDetailModal({
  bill,
  onClose,
}: {
  bill: BillItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[28px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Invoice Details
              </p>
              <h3 className="text-lg font-bold text-white mt-1">
                {bill.invoiceNumber}
              </h3>
            </div>
            <StatusBadge status={bill.status} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <DetailRow icon={User} label="Doctor" value={`Dr. ${bill.doctorName}`} />
            <DetailRow icon={Stethoscope} label="Specialization" value={bill.specialization} />
            <DetailRow icon={Calendar} label="Appointment" value={formatDate(bill.appointmentDate)} />
            <DetailRow icon={Clock} label="Time" value={bill.appointmentTime || "—"} />
            <DetailRow icon={FileText} label="Type" value={bill.appointmentType} />
            <DetailRow icon={Receipt} label="Department" value={String(bill.department)} />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(bill.amount)}
              </p>
            </div>
            {bill.description && (
              <p className="text-xs text-slate-500 mt-2">{bill.description}</p>
            )}
          </div>

          <p className="text-[10px] text-slate-600 text-right">
            Created {formatDate(bill.createdAt)}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-slate-800 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-sm font-bold transition"
          >
            Close
          </button>
          {bill.status === "pending" && (
            <button
              type="button"
              onClick={() => alert("Payment gateway integration coming soon!")}
              className="flex-[2] py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl text-sm font-bold transition shadow-xl shadow-teal-500/20"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
          {label}
        </p>
        <p className="text-sm text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */

export default function BillingDashboard() {
  const [bills, setBills] = useState<BillItem[]>([]);
  const [summary, setSummary] = useState<BillingSummary>({
    totalBilled: 0,
    totalPaid: 0,
    totalPending: 0,
    count: 0,
  });
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);

  const fetchBilling = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch("/api/patient/billing");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to load billing data");
        return;
      }

      setBills(data.bills);
      setSummary(data.summary);
    } catch {
      setError("Network error loading billing data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const filtered =
    filter === "all" ? bills : bills.filter((b) => b.status === filter);

  const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
  ];

  /* ---- Render ---- */

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-red-400 font-semibold">{error}</p>
        <button
          type="button"
          onClick={fetchBilling}
          className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white font-bold transition"
        >
          Retry
        </button>
      </GlassCard>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={Receipt}
          label="Total Bills"
          value={String(summary.count)}
          accent="bg-teal-500/10 text-teal-400"
        />
        <SummaryCard
          icon={IndianRupee}
          label="Total Billed"
          value={formatCurrency(summary.totalBilled)}
          accent="bg-violet-500/10 text-violet-400"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Paid"
          value={formatCurrency(summary.totalPaid)}
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Pending"
          value={formatCurrency(summary.totalPending)}
          accent="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              filter === f.value
                ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                : "text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bills */}
      {bills.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Receipt className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-xl font-semibold text-white">No bills yet</p>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Your billing history will appear here once you book an appointment
            with a doctor.
          </p>
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <p className="text-slate-400">
            No {filter} bills found.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((bill) => (
            <GlassCard
              key={bill.id}
              className="p-0 overflow-hidden hover:border-slate-700 transition-colors cursor-pointer group"
            >
              <button
                type="button"
                className="w-full text-left p-5 md:p-6"
                onClick={() => setSelectedBill(bill)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: invoice + doctor */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 rounded-2xl bg-slate-800 shrink-0">
                      <FileText className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {bill.invoiceNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400 truncate">
                          Dr. {bill.doctorName}
                        </span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-500">
                          {bill.specialization}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: date + type */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 md:shrink-0">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(bill.appointmentDate)}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5">
                      <Stethoscope className="w-3 h-3" />
                      {bill.appointmentType}
                    </span>
                  </div>

                  {/* Right: amount + status + arrow */}
                  <div className="flex items-center gap-4 md:shrink-0">
                    <div className="text-right">
                      <p className="text-base font-bold text-white">
                        {formatCurrency(bill.amount)}
                      </p>
                    </div>
                    <StatusBadge status={bill.status} />
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors hidden md:block" />
                  </div>
                </div>
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </>
  );
}
