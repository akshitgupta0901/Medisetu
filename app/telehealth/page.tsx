"use client";

import ConsultationList from "@/components/telehealth/consultation-list";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function TelehealthPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-teal-400">Live Consultations</h1>
            <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role} portal</p>
          </div>
          <Link
            href={user?.role === "doctor" ? "/doctor" : "/patient"}
            className="text-sm text-slate-400 hover:text-teal-300"
          >
            Dashboard
          </Link>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <ConsultationList />
      </div>
    </main>
  );
}
