"use client";

import { motion } from "framer-motion";

const patients = [
  {
    id: "PT-88421",
    name: "Robert Simmons",
    age: 68,
    department: "Cardiology",
    risk: "High",
    riskColor: "text-red-400",
    lastVisit: "2h ago",
  },
  {
    id: "PT-77219",
    name: "Elena Martínez",
    age: 42,
    department: "Primary Care",
    risk: "Moderate",
    riskColor: "text-amber-400",
    lastVisit: "Today",
  },
  {
    id: "PT-91003",
    name: "Michael Carter",
    age: 55,
    department: "Neurology",
    risk: "Moderate",
    riskColor: "text-amber-400",
    lastVisit: "Yesterday",
  },
  {
    id: "PT-65012",
    name: "Aisha Rahman",
    age: 31,
    department: "OB/GYN",
    risk: "Low",
    riskColor: "text-emerald-400",
    lastVisit: "3d ago",
  },
  {
    id: "PT-44188",
    name: "David Chen",
    age: 74,
    department: "Oncology",
    risk: "High",
    riskColor: "text-red-400",
    lastVisit: "In triage",
  },
];

export default function PatientManagement() {
  return (
    <motion.section
      id="patients"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Patient Registry</h3>
          <p className="text-slate-400 text-sm mt-1">
            847 admissions this quarter · 23 pending intake reviews
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search patients..."
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 w-full sm:w-48"
          />
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold whitespace-nowrap transition"
          >
            Intake
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:border-teal-500/25 transition"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-11 w-11 rounded-full bg-blue-950/60 border border-blue-500/20 flex items-center justify-center shrink-0">
                👤
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-white truncate">{patient.name}</h4>
                  <span className="text-xs text-slate-500">{patient.id}</span>
                </div>
                <p className="text-sm text-slate-400">
                  {patient.age} yrs · {patient.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 pl-[3.75rem] sm:pl-0">
              <div className="text-right">
                <p className={`text-sm font-medium ${patient.riskColor}`}>
                  {patient.risk} risk
                </p>
                <p className="text-xs text-slate-500">Last: {patient.lastVisit}</p>
              </div>
              <button
                type="button"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-sm transition shrink-0"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full py-2 text-sm text-teal-400 hover:text-teal-300 transition"
      >
        View full registry →
      </button>
    </motion.section>
  );
}
