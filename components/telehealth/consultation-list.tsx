"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/fetch-auth";
import { useAuth } from "@/contexts/auth-context";
import type { LiveConsultationRow } from "@/types/live-consultation";
import { Loader2, PlayCircle, CheckCircle, Clock, XCircle } from "lucide-react";

export default function ConsultationList() {
  const { user } = useAuth();
  const [items, setItems] = useState<LiveConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await authFetch("/api/live-consultations");
      const data = await res.json();
      if (data.success) setItems(data.consultations);
      else setError(data.message);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await authFetch(`/api/live-consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 text-[10px] font-bold uppercase"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active</span>;
      case "scheduled": return <span className="text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20 text-[10px] font-bold uppercase">Scheduled</span>;
      case "completed": return <span className="text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-[10px] font-bold uppercase">Completed</span>;
      default: return <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  if (loading) return <p className="text-center text-slate-400 py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading consultations...</p>;
  if (error) return <p className="text-center text-red-300 py-16">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">{items.length} consultation(s)</p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-slate-400 py-12">No consultations yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-teal-500/30 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white font-bold">{c.reason}</p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {user?.role === "patient" ? `Dr. ${c.doctorName}` : `Patient: ${c.patientName}`}
                  </p>
                </div>
                {getStatusBadge(c.status)}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/telehealth/${c.id}`}
                  className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 font-medium"
                >
                  <PlayCircle className="w-4 h-4" /> Join Session
                </Link>

                {user?.role === "doctor" && c.status === "scheduled" && (
                   <button 
                     onClick={() => updateStatus(c.id, "active")}
                     className="text-xs bg-teal-500 text-slate-950 font-bold px-3 py-1 rounded-lg hover:bg-teal-400 transition"
                   >
                     Start Now
                   </button>
                )}
                {user?.role === "doctor" && c.status === "active" && (
                   <button 
                     onClick={() => updateStatus(c.id, "completed")}
                     className="text-xs bg-slate-700 text-white font-bold px-3 py-1 rounded-lg hover:bg-slate-600 transition"
                   >
                     Finish
                   </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
