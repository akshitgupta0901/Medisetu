"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Calendar, Clock, Video, MapPin, FileText, Loader2, AlertCircle } from "lucide-react";
import { authFetch } from "@/lib/fetch-auth";
import { getMinBookingDateString, getMaxBookingDateString } from "@/lib/appointments";

interface CreateAppointmentModalProps {
  report: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAppointmentModal({
  report,
  onClose,
  onSuccess,
}: CreateAppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [date, setDate] = useState(getMinBookingDateString());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [type, setType] = useState<"Online" | "In-Person">("Online");
  const [notes, setNotes] = useState("");
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const fetchAvailability = useCallback(async () => {
    setSlotsLoading(true);
    setSelectedTime(null);
    try {
      const doctorId = report.doctorId?._id || report.doctorId;
      const dayOfWeek = new Date(date).getDay();

      // Fetch availability for this doctor and day
      const availRes = await authFetch(`/api/doctors/availability?doctorId=${doctorId}`);
      const availData = await availRes.json();
      
      // Fetch existing appointments for this doctor and date
      const apptRes = await authFetch(`/api/appointments?doctorId=${doctorId}&date=${date}`);
      const apptData = await apptRes.json();

      if (availData.success && apptData.success) {
        const dayAvailability = availData.availability.filter((s: any) => s.dayOfWeek === dayOfWeek);
        const booked = apptData.appointments
          .filter((a: any) => a.status !== "Cancelled")
          .map((a: any) => a.appointmentTime);
        
        setBookedSlots(booked);

        const slots: string[] = [];
        dayAvailability.forEach((period: any) => {
          let current = new Date(`2000-01-01T${period.startTime}`);
          const end = new Date(`2000-01-01T${period.endTime}`);
          
          while (current < end) {
            const timeStr = current.toTimeString().substring(0, 5);
            slots.push(timeStr);
            current.setMinutes(current.getMinutes() + 30); // 30 min slots
          }
        });
        setAvailableSlots(slots);
      }
    } catch (err) {
      console.error("Failed to fetch availability:", err);
    } finally {
      setSlotsLoading(false);
    }
  }, [date, report.doctorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const triageId = report.id || report._id;
      const res = await authFetch(`/api/triage/${triageId}/appointment`, {
        method: "POST",
        body: JSON.stringify({
          appointmentDate: date,
          appointmentTime: selectedTime,
          appointmentType: type,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to create appointment");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Schedule Appointment</h3>
            <p className="text-xs text-slate-500 mt-1">
              Patient: <span className="text-teal-400 font-medium">{report.patientName || report.patientId?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={12} /> Select Date
              </label>
              <input
                type="date"
                required
                min={getMinBookingDateString()}
                max={getMaxBookingDateString()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-teal-500 outline-none transition-all text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} /> Available Slots
              </label>
              
              {slotsLoading ? (
                <div className="flex items-center justify-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                  <Loader2 className="animate-spin text-teal-500" size={24} />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed text-center">
                  <p className="text-xs text-slate-500">No availability configured for this day</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedTime === slot;
                    
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          isBooked 
                            ? "bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed line-through" 
                            : isSelected
                              ? "bg-teal-500 border-teal-400 text-slate-950"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-teal-500/50 hover:text-teal-400"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Appointment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("Online")}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                  type === "Online"
                    ? "bg-teal-500/10 border-teal-500 text-teal-400"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                }`}
              >
                <Video size={16} />
                <span className="text-sm font-bold">Online</span>
              </button>
              <button
                type="button"
                onClick={() => setType("In-Person")}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                  type === "In-Person"
                    ? "bg-teal-500/10 border-teal-500 text-teal-400"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                }`}
              >
                <MapPin size={16} />
                <span className="text-sm font-bold">In-Person</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FileText size={12} /> Additional Notes
            </label>
            <textarea
              placeholder="Instructions for the patient..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-teal-500 outline-none transition-all h-24 resize-none text-white"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTime}
              className="flex-[2] py-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Scheduling...</span>
                </>
              ) : (
                "Confirm Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
