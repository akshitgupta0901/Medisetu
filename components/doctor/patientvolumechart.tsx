"use client";

export default function PatientVolumeChart() {
  const data = [40, 65, 90, 55, 75, 30, 20];
  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">
        Daily Patient Volume
      </h3>

      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              style={{ height: `${value}%` }}
              className={`
                w-full rounded-t-md transition-all duration-300
                ${
                  index === 2
                    ? "bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]"
                    : "bg-slate-700"
                }
              `}
            />

            <span
              className={`text-xs ${
                index === 2
                  ? "text-teal-400"
                  : "text-slate-500"
              }`}
            >
              {labels[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-800 pt-4 flex justify-between">
        <div>
          <p className="text-slate-500 text-sm">
            Current Week
          </p>

          <p className="font-bold text-white">
            284 Patients
          </p>
        </div>

        <p className="text-emerald-400">
          +8%
        </p>
      </div>
    </div>
  );
}