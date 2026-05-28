"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { authFetch } from "@/lib/fetch-auth";
import type { SafeAppointment } from "@/types/appointment";
import GlassCard from "./glasscard";
import type { ApprovedPrescriptionPatient } from "./types";

interface MedicationForm {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionEditorProps {
  selectedPatient: ApprovedPrescriptionPatient | null;
  onPatientSelect: (patient: ApprovedPrescriptionPatient | null) => void;
}

const emptyMedication: MedicationForm = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

function mapAppointmentToPatient(appt: SafeAppointment): ApprovedPrescriptionPatient | null {
  if (!appt.patient) return null;
  return {
    appointmentId: appt._id,
    patientId: appt.patientId,
    name: appt.patient.name,
    email: appt.patient.email,
    date: appt.appointmentDate || appt.date,
    time: appt.appointmentTime || appt.time,
    department: appt.department,
    reason: appt.reason,
  };
}

export default function PrescriptionEditor({
  selectedPatient,
  onPatientSelect,
}: PrescriptionEditorProps) {
  const [patients, setPatients] = useState<ApprovedPrescriptionPatient[]>([]);
  const [medications, setMedications] = useState<MedicationForm[]>([
    { ...emptyMedication },
  ]);
  const [notes, setNotes] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedAppointmentId = selectedPatient?.appointmentId ?? "";

  const loadApprovedPatients = useCallback(async () => {
    setLoadingPatients(true);
    setError(null);

    try {
      const res = await authFetch("/api/appointments?status=all");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to load approved appointments");
        onPatientSelect(null);
        return;
      }

      const uniquePatients = new Map<string, ApprovedPrescriptionPatient>();
      for (const appointment of data.appointments as SafeAppointment[]) {
        if (appointment.status === "Cancelled") continue;
        
        const patient = mapAppointmentToPatient(appointment);
        if (patient && !uniquePatients.has(patient.patientId)) {
          uniquePatients.set(patient.patientId, patient);
        }
      }

      const nextPatients = [...uniquePatients.values()];
      setPatients(nextPatients);

      if (nextPatients.length === 0) {
        onPatientSelect(null);
      }
    } catch {
      setError("Network error loading approved patients");
      onPatientSelect(null);
    } finally {
      setLoadingPatients(false);
    }
  }, [onPatientSelect]);

  useEffect(() => {
    loadApprovedPatients();
  }, [loadApprovedPatients]);

  useEffect(() => {
    if (loadingPatients || patients.length === 0) return;
    if (
      !selectedAppointmentId ||
      !patients.some((patient) => patient.appointmentId === selectedAppointmentId)
    ) {
      onPatientSelect(patients[0]);
    }
  }, [loadingPatients, onPatientSelect, patients, selectedAppointmentId]);

  const canSubmit = useMemo(
    () =>
      Boolean(selectedPatient) &&
      medications.some(
        (medication) =>
          medication.name.trim() &&
          medication.dosage.trim() &&
          medication.frequency.trim() &&
          medication.duration.trim()
      ),
    [medications, selectedPatient]
  );

  function updateMedication(
    index: number,
    key: keyof MedicationForm,
    value: string
  ) {
    setMedications((current) =>
      current.map((medication, i) =>
        i === index ? { ...medication, [key]: value } : medication
      )
    );
  }

  function addMedication() {
    setMedications((current) => [...current, { ...emptyMedication }]);
  }

  function removeMedication(index: number) {
    setMedications((current) =>
      current.length === 1
        ? [{ ...emptyMedication }]
        : current.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedPatient) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const cleanedMedications = medications
      .map((medication) => ({
        name: medication.name.trim(),
        dosage: medication.dosage.trim(),
        frequency: medication.frequency.trim(),
        duration: medication.duration.trim(),
        instructions: medication.instructions.trim(),
      }))
      .filter(
        (medication) =>
          medication.name &&
          medication.dosage &&
          medication.frequency &&
          medication.duration
      );

    try {
      const res = await authFetch("/api/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedPatient.patientId,
          appointmentId: selectedPatient.appointmentId,
          medications: cleanedMedications,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to save prescription");
        return;
      }

      setSuccess("Prescription saved to MongoDB and sent to the patient.");
      setMedications([{ ...emptyMedication }]);
      setNotes("");
    } catch {
      setError("Network error saving prescription");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Prescription Editor
            </p>

            <h3 className="text-xl font-bold mt-2">
              Medication Details
            </h3>
          </div>

          <span className="text-xs text-slate-500">
            MongoDB backed
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Approved Patient
            </label>

            <div className="relative">
              <select
                value={selectedAppointmentId}
                onChange={(event) => {
                  const patient =
                    patients.find(
                      (item) => item.appointmentId === event.target.value
                    ) ?? null;
                  onPatientSelect(patient);
                }}
                disabled={loadingPatients || patients.length === 0}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  outline-none
                  focus:border-teal-400
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loadingPatients ? (
                  <option>Loading approved patients...</option>
                ) : patients.length === 0 ? (
                  <option>No approved appointment patients</option>
                ) : (
                  patients.map((patient) => (
                    <option
                      key={patient.appointmentId}
                      value={patient.appointmentId}
                    >
                      {patient.name} - {patient.date} at {patient.time}
                    </option>
                  ))
                )}
              </select>

              {loadingPatients && (
                <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-teal-400" />
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          )}

          {medications.map((medication, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">
                  Medication {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 text-red-300 transition hover:bg-red-500/10"
                  aria-label={`Remove medication ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-slate-400">
                  Medication Name
                  <input
                    value={medication.name}
                    onChange={(event) =>
                      updateMedication(index, "name", event.target.value)
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                    placeholder="e.g. Amoxicillin"
                  />
                </label>

                <label className="block text-sm text-slate-400">
                  Dosage
                  <input
                    value={medication.dosage}
                    onChange={(event) =>
                      updateMedication(index, "dosage", event.target.value)
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                    placeholder="e.g. 500mg"
                  />
                </label>

                <label className="block text-sm text-slate-400">
                  Frequency
                  <input
                    value={medication.frequency}
                    onChange={(event) =>
                      updateMedication(index, "frequency", event.target.value)
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                    placeholder="e.g. Twice daily"
                  />
                </label>

                <label className="block text-sm text-slate-400">
                  Duration
                  <input
                    value={medication.duration}
                    onChange={(event) =>
                      updateMedication(index, "duration", event.target.value)
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                    placeholder="e.g. 7 days"
                  />
                </label>

                <label className="block text-sm text-slate-400 md:col-span-2">
                  Instructions
                  <textarea
                    value={medication.instructions}
                    onChange={(event) =>
                      updateMedication(
                        index,
                        "instructions",
                        event.target.value
                      )
                    }
                    rows={2}
                    className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                    placeholder="e.g. Take after food"
                  />
                </label>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMedication}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-teal-400 hover:text-teal-300"
          >
            <Plus className="h-4 w-4" />
            Add Medication
          </button>

          <label className="block text-sm text-slate-400">
            Doctor Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-400"
              placeholder="Optional patient instructions or follow-up plan..."
            />
          </label>

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            Save Prescription
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
}
