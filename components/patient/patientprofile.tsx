"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import GlassCard from "./glasscard";
import { authFetch } from "@/lib/fetch-auth";
import type {
  SafePatientRecord,
  BloodGroup,
  MedicalHistoryEntry,
  MedicationEntry,
  EmergencyContact,
} from "@/types/patient-record";

const BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown",
];

const emptyEmergency: EmergencyContact = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
};

export default function PatientProfile() {
  const [record, setRecord] = useState<SafePatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("Unknown");
  const [allergiesText, setAllergiesText] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergency, setEmergency] = useState<EmergencyContact>(emptyEmergency);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryEntry[]>([]);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);

  const populateForm = useCallback((r: SafePatientRecord) => {
    setBloodGroup(r.bloodGroup);
    setAllergiesText(r.allergies.join(", "));
    setDateOfBirth(r.dateOfBirth ?? "");
    setGender(r.gender ?? "");
    setPhone(r.phone ?? "");
    setAddress(r.address ?? "");
    setEmergency(r.emergencyContact ?? emptyEmergency);
    setMedicalHistory(r.medicalHistory);
    setMedications(r.medications);
  }, []);

  const fetchRecord = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/patients");
      const data = await res.json();
      if (res.ok && data.success && data.records.length > 0) {
        setRecord(data.records[0]);
        populateForm(data.records[0]);
      } else {
        setRecord(null);
      }
    } catch {
      setError("Failed to load medical record");
    } finally {
      setLoading(false);
    }
  }, [populateForm]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      bloodGroup,
      allergies: allergiesText
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      dateOfBirth: dateOfBirth || undefined,
      gender,
      phone,
      address,
      emergencyContact: emergency,
      medicalHistory,
      medications,
    };

    try {
      const url = record ? `/api/patients/${record._id}` : "/api/patients";
      const method = record ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Save failed");
        return;
      }

      setRecord(data.record);
      populateForm(data.record);
      setSuccess(data.message ?? "Profile saved successfully");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  function addHistory() {
    setMedicalHistory([
      ...medicalHistory,
      { condition: "", status: "active", notes: "" },
    ]);
  }

  function addMedication() {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "" },
    ]);
  }

  if (loading) {
    return (
      <GlassCard className="p-8">
        <p className="text-[#c5c6cd]">Loading medical profile...</p>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlassCard className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-1">Medical Profile</h2>
        <p className="text-sm text-[#c5c6cd] mb-6">
          {record ? "Update your health information" : "Create your patient record"}
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-[#1E5128] bg-[#86db70]/10 px-4 py-3 text-sm text-[#86db70]">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#94a3b8] uppercase">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="mt-1 w-full bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] uppercase">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 w-full bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] uppercase">Gender</label>
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="e.g. Female"
              className="mt-1 w-full bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] uppercase">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[#94a3b8] uppercase">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-[#94a3b8] uppercase">
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="Penicillin, Peanuts, Latex"
              className="mt-1 w-full bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={emergency.name}
            onChange={(e) => setEmergency({ ...emergency, name: e.target.value })}
            className="bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
          />
          <input
            placeholder="Relationship"
            value={emergency.relationship}
            onChange={(e) =>
              setEmergency({ ...emergency, relationship: e.target.value })
            }
            className="bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
          />
          <input
            placeholder="Phone"
            value={emergency.phone}
            onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })}
            required
            className="bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
          />
          <input
            placeholder="Email (optional)"
            type="email"
            value={emergency.email ?? ""}
            onChange={(e) => setEmergency({ ...emergency, email: e.target.value })}
            className="bg-[#101415] border border-[#1E5128] rounded-xl p-3 text-white"
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Medical History</h3>
          <button
            type="button"
            onClick={addHistory}
            className="text-sm text-[#86db70] hover:underline"
          >
            + Add condition
          </button>
        </div>
        <div className="space-y-3">
          {medicalHistory.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl border border-[#1E5128] p-4 bg-[#1d2022]"
            >
              <input
                placeholder="Condition"
                value={entry.condition}
                onChange={(e) => {
                  const next = [...medicalHistory];
                  next[i] = { ...entry, condition: e.target.value };
                  setMedicalHistory(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              />
              <input
                type="date"
                value={entry.diagnosedDate ?? ""}
                onChange={(e) => {
                  const next = [...medicalHistory];
                  next[i] = { ...entry, diagnosedDate: e.target.value };
                  setMedicalHistory(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              />
              <select
                value={entry.status}
                onChange={(e) => {
                  const next = [...medicalHistory];
                  next[i] = {
                    ...entry,
                    status: e.target.value as MedicalHistoryEntry["status"],
                  };
                  setMedicalHistory(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              >
                <option value="active">Active</option>
                <option value="chronic">Chronic</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  setMedicalHistory(medicalHistory.filter((_, idx) => idx !== i))
                }
                className="text-red-400 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Medications</h3>
          <button
            type="button"
            onClick={addMedication}
            className="text-sm text-[#86db70] hover:underline"
          >
            + Add medication
          </button>
        </div>
        <div className="space-y-3">
          {medications.map((med, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 rounded-xl border border-[#1E5128] p-4 bg-[#1d2022]"
            >
              <input
                placeholder="Name"
                value={med.name}
                onChange={(e) => {
                  const next = [...medications];
                  next[i] = { ...med, name: e.target.value };
                  setMedications(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              />
              <input
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) => {
                  const next = [...medications];
                  next[i] = { ...med, dosage: e.target.value };
                  setMedications(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              />
              <input
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => {
                  const next = [...medications];
                  next[i] = { ...med, frequency: e.target.value };
                  setMedications(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              />
              <input
                placeholder="Prescribed by"
                value={med.prescribedBy ?? ""}
                onChange={(e) => {
                  const next = [...medications];
                  next[i] = { ...med, prescribedBy: e.target.value };
                  setMedications(next);
                }}
                className="bg-[#101415] border border-[#1E5128] rounded-lg p-2 text-white text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setMedications(medications.filter((_, idx) => idx !== i))
                }
                className="text-red-400 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {record && record.doctorNotes.length > 0 && (
        <GlassCard className="p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-4">Doctor Notes</h3>
          <div className="space-y-3">
            {record.doctorNotes.map((note, i) => (
              <div
                key={note._id ?? i}
                className="rounded-xl border border-[#1E5128] bg-[#1d2022] p-4"
              >
                <p className="text-xs text-[#86db70]">
                  {note.doctorName ?? "Doctor"} ·{" "}
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-sm text-[#e0e3e5] mt-2">{note.note}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#86db70] text-black font-bold disabled:opacity-50"
      >
        {saving ? "Saving..." : record ? "Save Changes" : "Create Profile"}
      </button>
    </form>
  );
}
