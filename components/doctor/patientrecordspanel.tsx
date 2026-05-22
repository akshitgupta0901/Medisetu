"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";
import type { SafePatientRecord } from "@/types/patient-record";
export default function PatientRecordsPanel() {
  const [records, setRecords] = useState<SafePatientRecord[]>([]);
  const [selected, setSelected] = useState<SafePatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/patients");
      const data = await res.json();
      if (res.ok && data.success) {
        setRecords(data.records);
        setSelected((prev) =>
          prev
            ? data.records.find((r: SafePatientRecord) => r._id === prev._id) ?? data.records[0]
            : data.records[0] ?? null
        );
      } else {
        setError(data.message ?? "Failed to load records");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  async function handleAddNote() {
    if (!selected || !note.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await authFetch(`/api/patients/${selected._id}`, {
        method: "PUT",
        body: JSON.stringify({ doctorNote: note.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to add note");
        return;
      }
      setNote("");
      setSuccess("Note added successfully");
      setSelected(data.record);
      fetchRecords();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      id="patient-records"
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Patient Records</h3>
        <p className="text-slate-400 text-sm mt-1">
          {records.length} medical profiles on file
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-4 py-3 text-sm text-teal-300">
          {success}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm py-8 text-center">Loading records...</p>
      ) : records.length === 0 ? (
        <p className="text-slate-400 text-sm py-8 text-center">
          No patient records found yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {records.map((r) => (
              <button
                key={r._id}
                type="button"
                onClick={() => setSelected(r)}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  selected?._id === r._id
                    ? "border-teal-500/40 bg-teal-500/10"
                    : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                }`}
              >
                <p className="font-medium text-white">
                  {r.user?.name ?? "Patient"}
                </p>
                <p className="text-xs text-slate-500 mt-1">{r.user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-teal-400">{r.bloodGroup}</span>
                  {r.allergies.length > 0 && (
                    <span className="text-xs text-red-400">
                      {r.allergies.length} allergies
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="lg:col-span-2 space-y-4 max-h-[560px] overflow-y-auto pr-1">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h4 className="text-lg font-bold text-white">
                  {selected.user?.name ?? "Patient Profile"}
                </h4>
                <p className="text-sm text-slate-400">{selected.user?.email}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="rounded-lg bg-slate-900 p-3">
                    <p className="text-xs text-slate-500">Blood Group</p>
                    <p className="text-teal-400 font-semibold">{selected.bloodGroup}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3">
                    <p className="text-xs text-slate-500">DOB</p>
                    <p className="text-white text-sm">{selected.dateOfBirth ?? "—"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3">
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-white text-sm">{selected.phone ?? "—"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3">
                    <p className="text-xs text-slate-500">Gender</p>
                    <p className="text-white text-sm">{selected.gender ?? "—"}</p>
                  </div>
                </div>
              </div>

              {selected.allergies.length > 0 && (
                <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-4">
                  <p className="text-xs font-semibold text-red-400 uppercase">Allergies</p>
                  <p className="text-sm text-red-200 mt-1">
                    {selected.allergies.join(", ")}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-slate-800 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Emergency Contact
                </p>
                <p className="text-sm text-white">
                  {selected.emergencyContact.name || "—"} (
                  {selected.emergencyContact.relationship || "—"})
                </p>
                <p className="text-sm text-teal-400 mt-1">
                  {selected.emergencyContact.phone || "No phone"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                  Medications ({selected.medications.length})
                </p>
                {selected.medications.length === 0 ? (
                  <p className="text-sm text-slate-500">None recorded</p>
                ) : (
                  <ul className="space-y-2">
                    {selected.medications.map((m, i) => (
                      <li key={i} className="text-sm text-slate-300">
                        <span className="text-white font-medium">{m.name}</span> —{" "}
                        {m.dosage}, {m.frequency}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                  Medical History ({selected.medicalHistory.length})
                </p>
                {selected.medicalHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">None recorded</p>
                ) : (
                  <ul className="space-y-2">
                    {selected.medicalHistory.map((h, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-white">{h.condition}</span>
                        <span className="text-xs text-slate-500 capitalize">
                          {h.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                  Doctor Notes
                </p>
                {selected.doctorNotes.length === 0 ? (
                  <p className="text-sm text-slate-500 mb-3">No notes yet</p>
                ) : (
                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                    {selected.doctorNotes.map((n, i) => (
                      <div key={n._id ?? i} className="text-sm border-l-2 border-teal-500/50 pl-3">
                        <p className="text-teal-400 text-xs">
                          {n.doctorName} ·{" "}
                          {n.createdAt
                            ? new Date(n.createdAt).toLocaleString()
                            : ""}
                        </p>
                        <p className="text-slate-300 mt-0.5">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a clinical note..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm resize-none"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={saving || !note.trim()}
                  className="mt-3 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add Note"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
