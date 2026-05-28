"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Clock, Plus, Trash2 } from "lucide-react";
import { authFetch } from "@/lib/fetch-auth";

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

interface DoctorAvailabilityEditorProps {
  onSaved?: () => void;
}

export default function DoctorAvailabilityEditor({ onSaved }: DoctorAvailabilityEditorProps) {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await authFetch("/api/doctors/availability");
        const data = await res.json();
        if (data.success) {
          setAvailability(data.availability);
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const addSlot = (dayIndex: number) => {
    setAvailability([
      ...availability,
      { dayOfWeek: dayIndex, startTime: "09:00", endTime: "17:00", isAvailable: true }
    ]);
  };

  const removeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: any) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await authFetch("/api/doctors/availability", {
        method: "POST",
        body: JSON.stringify({ availability }),
      });
      if (res.ok) {
        setSuccess(true);
        onSaved?.();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save availability:", error);
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 rounded-2xl">
            <Clock className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Weekly Availability</h2>
            <p className="text-sm text-slate-400">Configure your working hours for each day</p>
          </div>
        </div>
        {success && (
          <span className="text-emerald-400 text-sm font-medium animate-in fade-in duration-500">
            Availability saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        <div className="space-y-6">
          {DAYS.map((day, dayIndex) => {
            const daySlots = availability
              .map((slot, index) => ({ ...slot, originalIndex: index }))
              .filter(slot => slot.dayOfWeek === dayIndex);

            return (
              <div key={day} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white">{day}</h3>
                  <button
                    type="button"
                    onClick={() => addSlot(dayIndex)}
                    className="p-1.5 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>

                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">No availability set for this day</p>
                ) : (
                  <div className="space-y-3">
                    {daySlots.map((slot) => (
                      <div key={slot.originalIndex} className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">From</span>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(slot.originalIndex, "startTime", e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">To</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(slot.originalIndex, "endTime", e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSlot(slot.originalIndex)}
                          className="ml-auto p-2 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-slate-950 font-bold rounded-2xl transition flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving Availability..." : "Save Availability"}
        </button>
      </form>
    </div>
  );
}
