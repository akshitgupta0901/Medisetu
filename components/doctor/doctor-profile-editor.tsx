"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, User } from "lucide-react";

export default function DoctorProfileEditor() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/doctors/profile");
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/doctors/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 rounded-2xl">
            <User className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Professional Profile</h2>
            <p className="text-sm text-slate-400">Manage your clinical information</p>
          </div>
        </div>
        {success && (
          <span className="text-emerald-400 text-sm font-medium animate-in fade-in duration-500">
            Changes saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</label>
            <input
              type="text"
              value={profile.specialization}
              onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification</label>
            <input
              type="text"
              value={profile.qualification}
              onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              placeholder="e.g. MBBS, MD (Cardiology)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital/Clinic Name</label>
            <input
              type="text"
              value={profile.hospital}
              onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience (Years)</label>
            <input
              type="number"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Fee ($)</label>
            <input
              type="number"
              value={profile.consultationFee}
              onChange={(e) => setProfile({ ...profile, consultationFee: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biography</label>
          <textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
            placeholder="Write a brief description about your expertise and background..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Availability</label>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-500">Start Time</label>
              <input
                type="time"
                value={profile.availability?.startTime || "09:00"}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  availability: { ...profile.availability, startTime: e.target.value } 
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500">End Time</label>
              <input
                type="time"
                value={profile.availability?.endTime || "17:00"}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  availability: { ...profile.availability, endTime: e.target.value } 
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

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
