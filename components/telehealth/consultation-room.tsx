"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-auth";
import { useAuth } from "@/contexts/auth-context";
import type { ConsultationMessageRow } from "@/types/live-consultation";
import Link from "next/link";

interface ConsultationRoomProps {
  consultationId: string;
}

export default function ConsultationRoom({ consultationId }: ConsultationRoomProps) {
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<Record<string, string> | null>(null);
  const [messages, setMessages] = useState<ConsultationMessageRow[]>([]);
  const [input, setInput] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [summary, setSummary] = useState("");

  const loadMessages = useCallback(async () => {
    const res = await authFetch(`/api/live-consultations/${consultationId}/messages`);
    const data = await res.json();
    if (res.ok && data.success) setMessages(data.messages);
  }, [consultationId]);

  const load = useCallback(async () => {
    try {
      const [cRes, callsRes] = await Promise.all([
        authFetch(`/api/live-consultations/${consultationId}`),
        authFetch(`/api/live-consultations/${consultationId}/calls`),
      ]);
      const cData = await cRes.json();
      const callsData = await callsRes.json();
      if (cRes.ok && cData.success) {
        setConsultation(cData.consultation);
        setDoctorNotes(cData.consultation.doctorNotes ?? "");
        setSummary(cData.consultation.summary ?? "");
      }
      if (callsRes.ok && callsData.success && callsData.activeSession) {
        setCallActive(true);
      }
      await loadMessages();
    } catch {
      setError("Failed to load consultation");
    } finally {
      setLoading(false);
    }
  }, [consultationId, loadMessages]);

  useEffect(() => {
    load();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [load, loadMessages]);

  useEffect(() => {
    if (!callActive) return;
    const t = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [callActive]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await authFetch(
      `/api/live-consultations/${consultationId}/messages`,
      { method: "POST", body: JSON.stringify({ content: input.trim() }) }
    );
    const data = await res.json();
    if (res.ok && data.success) {
      setInput("");
      loadMessages();
    }
  }

  async function joinCall() {
    const res = await authFetch(
      `/api/live-consultations/${consultationId}/calls`,
      { method: "POST", body: JSON.stringify({ action: "join" }) }
    );
    if (res.ok) {
      setCallActive(true);
      setCallDuration(0);
      await authFetch(`/api/live-consultations/${consultationId}`, {
        method: "PATCH",
        body: JSON.stringify({ join: true }),
      });
    }
  }

  async function leaveCall() {
    const res = await authFetch(
      `/api/live-consultations/${consultationId}/calls`,
      { method: "POST", body: JSON.stringify({ action: "leave" }) }
    );
    const data = await res.json();
    if (res.ok) {
      setCallActive(false);
      setCallDuration(data.session?.durationSeconds ?? callDuration);
    }
  }

  async function completeConsultation() {
    const res = await authFetch(`/api/live-consultations/${consultationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "completed",
        summary,
        doctorNotes,
      }),
    });
    if (res.ok) load();
  }

  async function saveNotes() {
    await authFetch(`/api/live-consultations/${consultationId}`, {
      method: "PATCH",
      body: JSON.stringify({ doctorNotes }),
    });
  }

  if (loading) {
    return <p className="text-center text-slate-400 py-20">Loading consultation room...</p>;
  }

  if (error || !consultation) {
    return (
      <p className="text-center text-red-300 py-20">{error ?? "Consultation not found"}</p>
    );
  }

  const isDoctor = user?.role === "doctor";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[70vh]">
      <div className="xl:col-span-2 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-white">{consultation.reason}</h2>
            <p className="text-xs text-slate-500 capitalize">{consultation.status}</p>
          </div>
          <div className="flex gap-2">
            {!callActive ? (
              <button
                type="button"
                onClick={joinCall}
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-sm font-semibold"
              >
                Join call
              </button>
            ) : (
              <button
                type="button"
                onClick={leaveCall}
                className="px-4 py-2 rounded-xl border border-red-500/40 text-red-300 text-sm"
              >
                Leave call ({callDuration}s)
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[320px] max-h-[480px]">
          {messages.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                  m.senderId === user?._id
                    ? "ml-auto bg-teal-500/20 text-teal-100"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <p className="text-xs text-slate-500 mb-1">
                  {m.senderName} · {new Date(m.createdAt).toLocaleTimeString()}
                </p>
                {m.content}
              </div>
            ))
          )}
        </div>

        {consultation.status !== "completed" && (
          <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-sm font-semibold"
            >
              Send
            </button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm">
          <p className="text-slate-500">Patient</p>
          <p className="text-white font-medium">{consultation.patientName}</p>
          <p className="text-slate-500 mt-3">Doctor</p>
          <p className="text-white font-medium">{consultation.doctorName}</p>
        </div>

        {callActive && (
          <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4 text-sm text-teal-200">
            WebRTC-ready session active. Connect peer media when signaling is configured.
          </div>
        )}

        {isDoctor && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <h3 className="font-semibold text-white text-sm">Clinical notes</h3>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
            <button
              type="button"
              onClick={saveNotes}
              className="w-full py-2 rounded-xl border border-slate-700 text-sm text-teal-300"
            >
              Save notes
            </button>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Consultation summary"
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
            {consultation.status !== "completed" && (
              <button
                type="button"
                onClick={completeConsultation}
                className="w-full py-2 rounded-xl bg-teal-500 text-slate-950 text-sm font-semibold"
              >
                Mark complete
              </button>
            )}
          </div>
        )}

        <Link href="/telehealth" className="block text-center text-sm text-teal-400 hover:underline">
          ← All consultations
        </Link>
      </div>
    </div>
  );
}
