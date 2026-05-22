"use client";

export default function RecentAlerts() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-5">
        Recent Alerts
      </h3>

      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-400 mt-2" />

          <div>
            <p className="text-teal-400 text-xs">
              14:22
            </p>

            <p className="text-sm text-white">
              Lab results ready: Robert Simmons
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-red-400 mt-2" />

          <div>
            <p className="text-red-400 text-xs">
              13:45
            </p>

            <p className="text-sm text-white">
              Medication vitals logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}