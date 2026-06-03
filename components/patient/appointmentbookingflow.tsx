"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  RotateCcw,
  Stethoscope,
  UserRound,
} from "lucide-react";
import GlassCard from "./glasscard";
import { authFetch } from "@/lib/fetch-auth";
import {
  getMaxBookingDateString,
  getMinBookingDateString,
  mapBookingTypeToAppointmentType,
} from "@/lib/appointments";
import type { SafeUser } from "@/types/auth";
import type { SafeAppointment } from "@/types/appointment";

type BookingDoctor = SafeUser & {
  hospital?: string;
  experience?: number;
  consultationFee?: number;
  availability?: {
    days?: string[];
    startTime?: string;
    endTime?: string;
  };
};

interface AppointmentBookingFlowProps {
  appointments: SafeAppointment[];
  rescheduleId?: string | null;
  onComplete?: () => void;
}

const steps = [
  { id: 1, label: "Specialty", icon: Stethoscope },
  { id: 2, label: "Doctor", icon: UserRound },
  { id: 3, label: "Date", icon: CalendarDays },
  { id: 4, label: "Time Slot", icon: Clock },
  { id: 5, label: "Confirm", icon: CalendarCheck },
];

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

function doctorSpecialty(doctor: BookingDoctor): string {
  return doctor.specialization?.trim() || "General Medicine";
}

function formatTime(time: string): string {
  const [hourRaw, minute = "00"] = time.split(":");
  const hour = Number(hourRaw);
  if (Number.isNaN(hour)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

export default function AppointmentBookingFlow({
  appointments,
  rescheduleId,
  onComplete,
}: AppointmentBookingFlowProps) {
  const [doctors, setDoctors] = useState<BookingDoctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"telehealth" | "in-person">("telehealth");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hydratedRescheduleId, setHydratedRescheduleId] = useState<string | null>(
    null
  );
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadDoctors() {
      setLoadingDoctors(true);
      setError(null);

      try {
        const res = await authFetch("/api/doctors");
        const data = await res.json();
        if (res.ok && data.success) {
          setDoctors(data.doctors ?? []);
        } else {
          setError(data.message ?? "Unable to load doctors");
        }
      } catch {
        setError("Network error loading doctors");
      } finally {
        setLoadingDoctors(false);
      }
    }

    loadDoctors();
  }, []);

  const rescheduleAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === rescheduleId),
    [appointments, rescheduleId]
  );

  useEffect(() => {
    if (!rescheduleId) {
      setHydratedRescheduleId(null);
      return;
    }

    if (
      !rescheduleAppointment ||
      doctors.length === 0 ||
      hydratedRescheduleId === rescheduleId
    ) {
      return;
    }

    const doctor = doctors.find((item) => item._id === rescheduleAppointment.doctorId);
    const specialty =
      doctor?.specialization?.trim() ||
      rescheduleAppointment.department ||
      "General Medicine";

    setSelectedSpecialty(specialty);
    setDoctorId(rescheduleAppointment.doctorId);
    setDate(rescheduleAppointment.appointmentDate);
    setTime(rescheduleAppointment.appointmentTime);
    setReason(rescheduleAppointment.notes ?? rescheduleAppointment.reason ?? "");
    setType(
      rescheduleAppointment.appointmentType === "In-Person"
        ? "in-person"
        : "telehealth"
    );
    setStep(3);
    setSuccess(null);
    setHydratedRescheduleId(rescheduleId);
  }, [doctors, hydratedRescheduleId, rescheduleAppointment, rescheduleId]);

  const specialties = useMemo(() => {
    const unique = new Set(doctors.map(doctorSpecialty));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  const filteredDoctors = useMemo(
    () =>
      doctors.filter(
        (doctor) => doctorSpecialty(doctor) === selectedSpecialty
      ),
    [doctors, selectedSpecialty]
  );

  const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);
  const selectedDoctorName = selectedDoctor?.name ?? "Selected doctor";
  const isRescheduling = Boolean(rescheduleId && rescheduleAppointment);

  function selectSpecialty(specialty: string) {
    setSelectedSpecialty(specialty);
    setDoctorId("");
    setDate("");
    setTime("");
    setSuccess(null);
    setStep(2);
  }

  function selectDoctor(id: string) {
    setDoctorId(id);
    setDate("");
    setTime("");
    setSuccess(null);
    setStep(3);
  }

  function continueToTimeSlots() {
    const selectedDate = date || dateInputRef.current?.value || "";

    if (!selectedDate) {
      setError("Choose a date before selecting a time slot.");
      return;
    }

    setDate(selectedDate);
    setTime("");
    setError(null);
    setStep(4);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const appointmentToReschedule = rescheduleAppointment ?? null;

    if (!doctorId || !date || !time) {
      setError("Choose a doctor, date, and time slot before confirming.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authFetch(
        appointmentToReschedule
          ? `/api/appointments/${appointmentToReschedule.id}`
          : "/api/appointments",
        {
          method: appointmentToReschedule ? "PATCH" : "POST",
          body: JSON.stringify(
            appointmentToReschedule
              ? {
                  appointmentDate: date,
                  appointmentTime: time,
                  notes: reason.trim(),
                }
              : {
                  doctorId,
                  appointmentDate: date,
                  appointmentTime: time,
                  appointmentType: mapBookingTypeToAppointmentType(type),
                  department: selectedSpecialty,
                  reason: reason.trim(),
                  notes: reason.trim(),
                }
          ),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Appointment booking failed");
        return;
      }

      setSuccess(
        appointmentToReschedule
          ? "Appointment rescheduled successfully."
          : data.message ?? "Appointment booked successfully."
      );
      onComplete?.();

      if (!appointmentToReschedule) {
        setSelectedSpecialty("");
        setDoctorId("");
        setDate("");
        setTime("");
        setReason("");
        setType("telehealth");
        setStep(1);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard className="p-5 md:p-7">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">
            {isRescheduling ? "Reschedule Visit" : "Book Appointment"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {isRescheduling
              ? "Choose a new date and time"
              : "Choose doctor and time"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Verified clinicians and appointment slots in one place.
          </p>
        </div>

        {isRescheduling && (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100">
            <RotateCcw size={17} />
            Rescheduling current visit
          </div>
        )}
      </div>

      <ol className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-5">
        {steps.map(({ id, label, icon: Icon }) => {
          const active = step === id;
          const complete = step > id;

          return (
            <li
              key={id}
              className={`rounded-2xl border px-3 py-3 ${
                active
                  ? "border-teal-300 bg-teal-300/10 text-teal-100"
                  : complete
                    ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
                    : "border-slate-800 bg-slate-950/60 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    active || complete
                      ? "bg-teal-300 text-slate-950"
                      : "bg-slate-900 text-slate-500"
                  }`}
                >
                  {complete ? <CheckCircle2 size={15} /> : <Icon size={15} />}
                </span>
                <span>{label}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-5 rounded-2xl border border-teal-400/30 bg-teal-400/10 px-4 py-3 text-sm text-teal-100">
          {success}
        </div>
      )}
      {rescheduleId && !rescheduleAppointment && !loadingDoctors && (
        <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          The selected appointment could not be found. You can still book a new
          appointment below.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-white">Select Specialty</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {loadingDoctors ? (
                <p className="text-sm text-slate-400">Loading verified doctors...</p>
              ) : specialties.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-400">
                  No verified doctors are available right now.
                </div>
              ) : (
                specialties.map((specialty) => {
                  const count = doctors.filter(
                    (doctor) => doctorSpecialty(doctor) === specialty
                  ).length;

                  return (
                    <button
                      type="button"
                      key={specialty}
                      onClick={() => selectSpecialty(specialty)}
                      className="min-h-24 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left transition hover:border-teal-300/60 hover:bg-teal-300/10 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      <span className="block text-base font-bold text-white">
                        {specialty}
                      </span>
                      <span className="mt-2 block text-sm text-slate-400">
                        {count} verified {count === 1 ? "doctor" : "doctors"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-white">Select Doctor</h3>
            <p className="mt-1 text-sm text-slate-400">{selectedSpecialty}</p>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <button
                  type="button"
                  key={doctor._id}
                  onClick={() => selectDoctor(doctor._id)}
                  className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    doctorId === doctor._id
                      ? "border-teal-300 bg-teal-300/10"
                      : "border-slate-800 bg-slate-950/70 hover:border-teal-300/60 hover:bg-teal-300/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-300/10 text-teal-200">
                      <UserRound size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{doctor.name}</p>
                      <p className="mt-1 text-sm text-teal-200">
                        {doctorSpecialty(doctor)}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {doctor.hospital || "Verified MediSetu clinician"}
                        {typeof doctor.experience === "number"
                          ? ` · ${doctor.experience} yrs experience`
                          : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-xl">
            <h3 className="text-lg font-semibold text-white">Select Date</h3>
            <p className="mt-1 text-sm text-slate-400">{selectedDoctorName}</p>
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setTime("");
              }}
              min={getMinBookingDateString()}
              max={getMaxBookingDateString()}
              required
              className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white outline-none transition focus:border-teal-300"
            />
            <button
              type="button"
              onClick={continueToTimeSlots}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-teal-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-200 sm:w-auto"
            >
              Continue to Time Slots
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-white">Select Time Slot</h3>
            <p className="mt-1 text-sm text-slate-400">
              {date} with {selectedDoctorName}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => {
                    setTime(slot);
                    setStep(5);
                  }}
                  className={`min-h-12 rounded-2xl border px-3 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    time === slot
                      ? "border-teal-300 bg-teal-300 text-slate-950"
                      : "border-slate-800 bg-slate-950/70 text-slate-100 hover:border-teal-300/60 hover:bg-teal-300/10"
                  }`}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-lg font-semibold text-white">Confirm Booking</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Doctor
                </p>
                <p className="mt-2 font-bold text-white">{selectedDoctorName}</p>
                <p className="mt-1 text-sm text-teal-200">{selectedSpecialty}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Visit
                </p>
                <p className="mt-2 font-bold text-white">
                  {date} at {formatTime(time)}
                </p>
                <p className="mt-1 text-sm text-teal-200">
                  {type === "telehealth" ? "Online" : "In-Person"}
                </p>
              </div>
            </div>

            {!isRescheduling && (
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Visit Type
                </label>
                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as "telehealth" | "in-person")
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white outline-none transition focus:border-teal-300"
                >
                  <option value="telehealth">Online / Telehealth</option>
                  <option value="in-person">In-person</option>
                </select>
              </div>
            )}

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Reason for Visit
              </label>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
                placeholder="Briefly describe your concern."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1 || submitting}
            className="min-h-11 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-teal-400/50 hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {step === 5 ? (
            <button
              type="submit"
              disabled={submitting || !doctorId || !date || !time}
              className="min-h-12 rounded-2xl bg-teal-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Confirming..."
                : isRescheduling
                  ? "Confirm Reschedule"
                  : "Confirm Booking"}
            </button>
          ) : (
            <p className="text-sm text-slate-500">
              {step === 1
                ? `${specialties.length} specialties available`
                : selectedDoctor?.name ?? selectedSpecialty}
            </p>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
