"use client";

import { useState } from "react";
import { exportData, type ExportFormat } from "@/lib/export-data";

interface ExportButtonProps<T extends Record<string, unknown>> {
  data: T[];
  filename: string;
  columns?: { key: keyof T; label: string }[];
  disabled?: boolean;
  className?: string;
}

export default function ExportButton<T extends Record<string, unknown>>({
  data,
  filename,
  columns,
  disabled,
  className = "",
}: ExportButtonProps<T>) {
  const [open, setOpen] = useState(false);

  function handleExport(format: ExportFormat) {
    exportData(format, data, filename, columns);
    setOpen(false);
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled || data.length === 0}
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-300 hover:border-teal-500/40 hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Export
      </button>
      {open && data.length > 0 && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close export menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 min-w-[140px] rounded-xl border border-slate-700 bg-slate-900 shadow-xl py-1">
            <button
              type="button"
              onClick={() => handleExport("csv")}
              className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-300"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport("json")}
              className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-300"
            >
              Export JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
