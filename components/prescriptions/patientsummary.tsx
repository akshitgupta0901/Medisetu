"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";
import type { ApprovedPrescriptionPatient } from "./types";

interface PatientSummaryProps {
  patient: ApprovedPrescriptionPatient | null;
}

export default function PatientSummary({ patient }: PatientSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {patient?.name ?? "Select an approved patient"}
            </h2>

            <p className="text-slate-400 mt-1">
              {patient
                ? `${patient.email} · Patient ID: ${patient.patientId.slice(-6).toUpperCase()}`
                : "Approved appointment patients will appear in the editor below."}
            </p>
          </div>

          <span
            className="
              w-fit
              px-4
              py-2
              rounded-full
              bg-teal-500/15
              border
              border-teal-500/30
              text-teal-400
              text-sm
              font-medium
            "
          >
            {patient ? "Approved visit" : "No patient selected"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Appointment
            </p>

            <p className="text-base font-bold mt-1 text-white">
              {patient ? patient.date : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Time
            </p>

            <p className="text-base font-bold mt-1 text-white">
              {patient ? patient.time : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Department
            </p>

            <p className="text-base font-bold text-teal-400 mt-1">
              {patient ? patient.department : "--"}
            </p>
          </div>
        </div>

        {patient && (
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Visit reason
            </p>
            <p className="mt-1 text-sm text-slate-300">{patient.reason}</p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
