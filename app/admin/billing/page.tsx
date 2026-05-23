"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageShell from "@/components/admin/admin-page-shell";
import ExportButton from "@/components/admin/export-button";
import { authFetch } from "@/lib/fetch-auth";
import type { AdminBillingSummary, AdminTransactionRow } from "@/types/admin";

export default function AdminBillingPage() {
  const [summary, setSummary] = useState<AdminBillingSummary | null>(null);
  const [items, setItems] = useState<AdminTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "15" });
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);

      const res = await authFetch(`/api/admin/billing?${params}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSummary(data.summary);
        setItems(data.items);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message ?? "Failed to load billing");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const exportRows = items.map((t) => ({
    id: t.id,
    patient: t.patientName,
    doctor: t.doctorName,
    amount: t.amount,
    status: t.status,
    description: t.description,
    date: t.createdAt.split("T")[0],
  }));

  const summaryCards = summary
    ? [
        { label: "Revenue (paid)", value: `$${summary.totalRevenue.toLocaleString()}` },
        { label: "Total billed", value: `$${summary.totalBilled.toLocaleString()}` },
        { label: "Consultations", value: summary.totalConsultations },
        { label: "Appointments", value: summary.totalAppointments },
      ]
    : [];

  return (
    <AdminPageShell
      title="Billing"
      subtitle="Transactions from completed appointments"
      actions={<ExportButton data={exportRows} filename="billing-export" />}
    >
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <p className="text-xs text-slate-500 uppercase">{card.label}</p>
              <p className="text-2xl font-bold text-teal-400 mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search patient, doctor, description..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-slate-400 text-sm">Loading transactions...</p>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-slate-400">
            No transactions yet. Complete appointments to generate billing records.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/30">
                    <td className="p-4 text-white">{row.patientName}</td>
                    <td className="p-4 text-slate-300">{row.doctorName}</td>
                    <td className="p-4 text-slate-400 max-w-[200px] truncate">
                      {row.description}
                    </td>
                    <td className="p-4 text-teal-400 font-medium">
                      ${row.amount.toLocaleString()}
                    </td>
                    <td className="p-4 capitalize text-slate-300">{row.status}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </AdminPageShell>
  );
}
