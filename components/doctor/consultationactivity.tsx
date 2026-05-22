"use client";

export default function ConsultationActivity() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-5">
        <span className="text-slate-400 uppercase text-xs">
          Consultation
        </span>

        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-teal-500/20">
          📹
        </div>

        <div>
          <p className="font-bold text-white">
            Room 12 Active
          </p>

          <p className="text-sm text-slate-500">
            Live Consultation
          </p>
        </div>
      </div>
    </div>
  );
}