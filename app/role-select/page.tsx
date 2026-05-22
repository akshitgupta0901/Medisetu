"use client";

import { useRouter } from "next/navigation";

export default function RoleSelectPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-3">
          Choose Your Role
        </h1>

        <p className="text-center text-slate-400 mb-12">
          Select how you want to use MediSetu
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/login")}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-teal-500 transition"
          >
            <div className="text-5xl mb-4">🧑</div>
            <h2 className="text-2xl font-bold">Patient</h2>
            <p className="text-slate-400 mt-2">
              Manage prescriptions and appointments
            </p>
          </button>

          <button
            onClick={() => router.push("/login")}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-teal-500 transition"
          >
            <div className="text-5xl mb-4">👨‍⚕️</div>
            <h2 className="text-2xl font-bold">Doctor</h2>
            <p className="text-slate-400 mt-2">
              Consult patients and manage treatment
            </p>
          </button>

          <button
            onClick={() => router.push("/login")}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-teal-500 transition"
          >
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-2xl font-bold">Admin</h2>
            <p className="text-slate-400 mt-2">
              Monitor platform and analytics
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}