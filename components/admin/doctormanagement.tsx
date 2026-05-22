"use client";

import { motion } from "framer-motion";

const doctors = [
  {
    name: "Dr. James Vance",
    specialty: "Cardiology",
    patients: 142,
    status: "On Duty",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    consultations: 8,
  },
  {
    name: "Dr. Elena Lombardi",
    specialty: "Internal Medicine",
    patients: 98,
    status: "Telehealth",
    statusColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    consultations: 12,
  },
  {
    name: "Dr. Michael Carter",
    specialty: "Neurology",
    patients: 76,
    status: "On Duty",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    consultations: 5,
  },
  {
    name: "Dr. Sarah Okonkwo",
    specialty: "Pediatrics",
    patients: 201,
    status: "Off Shift",
    statusColor: "text-slate-400 bg-slate-800/50 border-slate-700",
    consultations: 0,
  },
  {
    name: "Dr. Raj Patel",
    specialty: "Emergency Medicine",
    patients: 0,
    status: "Critical Load",
    statusColor: "text-red-400 bg-red-500/10 border-red-500/20",
    consultations: 19,
  },
];

export default function DoctorManagement() {
  return (
    <motion.section
      id="doctors"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Physician Management</h3>
          <p className="text-slate-400 text-sm mt-1">
            186 active · 5 departments · 2 license renewals due
          </p>
        </div>
        <button
          type="button"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-teal-500/20 text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition"
        >
          + Add Physician
        </button>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
              <th className="pb-3 pr-4 font-medium">Physician</th>
              <th className="pb-3 pr-4 font-medium">Specialty</th>
              <th className="pb-3 pr-4 font-medium">Panel Size</th>
              <th className="pb-3 pr-4 font-medium">Today</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {doctors.map((doc) => (
              <tr key={doc.name} className="group hover:bg-slate-800/30 transition">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-teal-500/15 flex items-center justify-center shrink-0">
                      👨‍⚕️
                    </div>
                    <span className="font-medium text-white group-hover:text-teal-300 transition">
                      {doc.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-slate-400">{doc.specialty}</td>
                <td className="py-4 pr-4 text-slate-300">{doc.patients}</td>
                <td className="py-4 pr-4 text-teal-400 font-medium">
                  {doc.consultations} visits
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${doc.statusColor}`}
                  >
                    {doc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
