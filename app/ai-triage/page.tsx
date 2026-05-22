import Link from "next/link";
import SymptomChecker from "@/components/ai-triage/symptomchecker";

export default function AITriagePage() {
  return (
    <main className="min-h-screen bg-[#07111d] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-cyan-200">
              MediSetu AI
            </Link>
            <span className="hidden sm:inline text-slate-600">|</span>
            <p className="hidden sm:block text-sm text-slate-400">AI Symptom Checker</p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/patient"
              className="text-slate-400 hover:text-cyan-200 transition"
            >
              Patient
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-200 px-4 py-2 font-semibold text-[#06111d] hover:bg-white transition"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(90deg,rgba(45,212,191,0.08),transparent,rgba(59,130,246,0.08))]" />

        <div className="relative mx-auto max-w-[960px]">
          <div className="mb-8 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/60">
              Powered by OpenAI
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              AI Symptom Checker
            </h1>
            <p className="mt-3 max-w-xl text-slate-400">
              Enter your symptoms for instant triage guidance — possible conditions,
              severity level, specialist recommendation, and urgency score.
            </p>
          </div>

          <SymptomChecker />
        </div>
      </div>

      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        MediSetu AI · For informational purposes only · Not emergency services
      </footer>
    </main>
  );
}
