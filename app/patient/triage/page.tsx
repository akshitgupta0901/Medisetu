"use client";

import Link from "next/link";
import SymptomChecker from "@/components/ai-triage/symptomchecker";
import PatientTriageHistory from "@/components/triage/patient-triage-history";

export default function PatientTriagePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8 max-w-4xl mx-auto space-y-10">
      <div>
        <Link href="/patient" className="text-sm text-teal-400 hover:underline">
          ← Patient dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-4">AI Triage</h1>
        <p className="text-slate-400 text-sm mt-1">
          Submit symptoms and track your triage reports
        </p>
      </div>
      <SymptomChecker />
      <section>
        <h2 className="text-lg font-semibold mb-4">Your triage history</h2>
        <PatientTriageHistory />
      </section>
    </main>
  );
}
