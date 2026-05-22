"use client";

export default function RecoveryTrends() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400 uppercase text-xs mb-4">
        Recovery Trends
      </p>

      <div className="flex items-end gap-2">
        <span className="text-5xl font-bold text-teal-400">
          +5%
        </span>

        <span className="text-slate-400 mb-2">
          rate increase
        </span>
      </div>
    </div>
  );
}