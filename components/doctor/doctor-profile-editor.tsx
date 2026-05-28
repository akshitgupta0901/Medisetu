"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, User, ShieldCheck } from "lucide-react";
import { authFetch } from "@/lib/fetch-auth";
import { calculateDoctorProfileCompletion } from "@/lib/doctor-profile";

interface DoctorProfileEditorProps {
  initialProfile: Record<string, unknown> | null;
  weeklySlotCount: number;
  onRefresh: () => void;
}

export default function DoctorProfileEditor({
  initialProfile,
  weeklySlotCount,
  onRefresh,
}: DoctorProfileEditorProps) {
  const [profile, setProfile] = useState<Record<string, unknown>>(
    initialProfile ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile);
  }, [initialProfile]);

  const completion =
    typeof initialProfile?.completionPercent === "number"
      ? initialProfile.completionPercent
      : calculateDoctorProfileCompletion(
          profile as Parameters<typeof calculateDoctorProfileCompletion>[0],
          weeklySlotCount
        );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const res = await authFetch("/api/doctors/profile", {
        method: "PATCH",
        body: JSON.stringify({
          specialization: profile.specialization,
          qualification: profile.qualification,
          hospital: profile.hospital,
          experience: profile.experience,
          consultationFee: profile.consultationFee,
          phone: profile.phone,
          bio: profile.bio,
          address: profile.address,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        onRefresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message ?? "Failed to save profile");
      }
    } catch {
      setError("Network error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 rounded-2xl">
            <User className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Professional Profile</h2>
              {profile?.verificationStatus === "Approved" && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={10} /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">Manage your clinical information</p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Completion
            </span>
            <span className="text-sm font-bold text-teal-400">{completion}%</span>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        {success && (
          <span className="text-emerald-400 text-sm font-medium animate-in fade-in duration-500">
            Changes saved successfully!
          </span>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Specialization *
            </label>
            <input
              type="text"
              value={String(profile.specialization ?? "")}
              onChange={(e) =>
                setProfile({ ...profile, specialization: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Qualification *
            </label>
            <input
              type="text"
              value={String(profile.qualification ?? "")}
              onChange={(e) =>
                setProfile({ ...profile, qualification: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              placeholder="e.g. MBBS, MD (Cardiology)"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hospital / Clinic Name *
            </label>
            <input
              type="text"
              value={String(profile.hospital ?? "")}
              onChange={(e) =>
                setProfile({ ...profile, hospital: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Experience (Years) *
            </label>
            <input
              type="number"
              min={0}
              value={Number(profile.experience ?? 0)}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  experience: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Consultation Fee ($) *
            </label>
            <input
              type="number"
              min={1}
              value={Number(profile.consultationFee ?? 0)}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  consultationFee: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Phone Number *
            </label>
            <input
              type="tel"
              value={String(profile.phone ?? "")}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Biography *
          </label>
          <textarea
            value={String(profile.bio ?? "")}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
            placeholder="Write a brief description about your expertise and background..."
            required
          />
        </div>

        <p className="text-xs text-slate-500">
          * Required for verification. Add at least one weekly availability slot below to reach 100%.
          {weeklySlotCount < 1 && (
            <span className="text-amber-400 block mt-1">
              No availability slots saved yet ({weeklySlotCount} configured).
            </span>
          )}
        </p>

        <button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-slate-950 font-bold rounded-2xl transition flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving Changes..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
