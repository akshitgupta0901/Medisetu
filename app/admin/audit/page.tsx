"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageShell from "@/components/admin/admin-page-shell";
import ExportButton from "@/components/admin/export-button";
import { authFetch } from "@/lib/fetch-auth";
import type { AdminAuditLogRow } from "@/types/admin";

export default function AdminAuditPage() {
  const [items, setItems] = useState<AdminAuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [resource, setResource] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (search.trim()) params.set("search", search.trim());
      if (action !== "all") params.set("action", action);
      if (resource !== "all") params.set("resource", resource);

      const res = await authFetch(`/api/admin/audit?${params}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.items);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message ?? "Failed to load audit logs");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [search, action, resource, page]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const exportRows = items.map((log) => ({
    user: log.userName,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId ?? "",
    details: log.details,
    timestamp: log.timestamp,
  }));

  return (
    <AdminPageShell
      title="Compliance & Audit"
      subtitle="Administrative action history"
      actions={<ExportButton data={exportRows} filename="audit-export" />}
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="search"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        />
        <select
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <option value="all">All actions</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="CREATE">CREATE</option>
        </select>
        <select
          value={resource}
          onChange={(e) => {
            setPage(1);
            setResource(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <option value="all">All entities</option>
          <option value="User">User</option>
          <option value="SystemConfig">SystemConfig</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-slate-400 text-sm">Loading audit logs...</p>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-slate-400">
            No audit entries yet. Admin actions will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="p-4 text-white">{log.userName}</td>
                    <td className="p-4">
                      <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-teal-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {log.entity}
                      {log.entityId && (
                        <span className="block text-xs text-slate-500 font-mono truncate max-w-[120px]">
                          {log.entityId}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 max-w-[240px] truncate">
                      {log.details || "—"}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
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
