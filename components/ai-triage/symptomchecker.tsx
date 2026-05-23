"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TriageAnalysis, SeverityLevel } from "@/types/ai-triage";
import { authFetch } from "@/lib/fetch-auth";

const SEVERITY_STYLES: Record<
  SeverityLevel,
  { label: string; color: string; ring: string; bg: string }
> = {
  low: {
    label: "Low",
    color: "text-emerald-300",
    ring: "border-emerald-400",
    bg: "bg-emerald-400/10",
  },
  moderate: {
    label: "Moderate",
    color: "text-amber-300",
    ring: "border-amber-400",
    bg: "bg-amber-400/10",
  },
  high: {
    label: "High",
    color: "text-orange-300",
    ring: "border-orange-400",
    bg: "bg-orange-400/10",
  },
  critical: {
    label: "Critical",
    color: "text-red-300",
    ring: "border-red-400",
    bg: "bg-red-400/10",
  },
};

const QUICK_SYMPTOMS = [
  "Headache and fever",
  "Chest pain and shortness of breath",
  "Persistent cough for 5 days",
  "Abdominal pain and nausea",
  "Dizziness and fatigue",
];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TriageAnalysis | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await authFetch("/api/ai-triage", {
        method: "POST",
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          age: age ? Number(age) : undefined,
          duration: duration.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Analysis failed. Please try again.");
        return;
      }

      setAnalysis(data.analysis);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const severity = analysis
    ? SEVERITY_STYLES[analysis.severityLevel]
    : null;

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a24] p-6 shadow-xl shadow-black/20 lg:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
            AI Symptom Checker
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Describe your symptoms
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Our AI analyzes your symptoms to suggest possible conditions, severity,
            and the right specialist. Not a substitute for professional medical advice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Symptoms *
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. I have had chest tightness and shortness of breath since this morning..."
              required
              minLength={3}
              maxLength={2000}
              rows={4}
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#08121d] px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-200/20 disabled:opacity-50 resize-none"
            />
            <p className="mt-1 text-xs text-slate-500">{symptoms.length}/2000</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Age (optional)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="35"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#08121d] px-4 py-3 text-white focus:border-cyan-200/40 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Duration (optional)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 days"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#08121d] px-4 py-3 text-white focus:border-cyan-200/40 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 w-full">Quick add:</span>
            {QUICK_SYMPTOMS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={loading}
                onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${s}` : s))}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-200/30 hover:text-cyan-100 transition disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || symptoms.trim().length < 3}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-8 py-3.5 text-sm font-semibold text-[#06111d] shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#06111d]/30 border-t-[#06111d]" />
                Analyzing symptoms...
              </>
            ) : (
              "Run AI Triage"
            )}
          </button>
        </form>
      </motion.section>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.section
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-white/10 bg-[#101a24] p-8 text-center"
          >
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-cyan-200/20 border-t-cyan-200" />
            <p className="mt-4 text-white font-medium">AI is analyzing your symptoms</p>
            <p className="mt-2 text-sm text-slate-400">
              Checking severity, conditions, and specialist routing...
            </p>
          </motion.section>
        )}

        {analysis && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <section className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#101a24] p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
                  Severity
                </p>
                <div className="mt-6 flex flex-col items-center">
                  <div
                    className={`relative flex h-44 w-44 items-center justify-center rounded-full border-[10px] ${severity?.ring}`}
                  >
                    <div className={`absolute inset-4 rounded-full ${severity?.bg}`} />
                    <div className="relative text-center">
                      <p className={`text-4xl font-bold ${severity?.color}`}>
                        {analysis.urgencyScore}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Urgency score</p>
                    </div>
                  </div>
                  <p className={`mt-4 text-xl font-semibold capitalize ${severity?.color}`}>
                    {severity?.label} severity
                  </p>
                  <p className="mt-2 text-sm text-slate-400 text-center max-w-xs">
                    {analysis.summary}
                  </p>
                </div>
              </section>

              <section className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#101a24] p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
                  Recommended specialist
                </p>
                <div className="mt-4 rounded-2xl border border-cyan-200/10 bg-cyan-200/[0.05] p-5">
                  <h3 className="text-2xl font-semibold text-cyan-100">
                    {analysis.recommendedSpecialist}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{analysis.careAdvice}</p>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
                  Possible conditions
                </p>
                <div className="mt-3 space-y-3">
                  {analysis.possibleConditions.map((c, i) => (
                    <div
                      key={`${c.name}-${i}`}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="font-semibold text-white">{c.name}</h4>
                        <span className="shrink-0 rounded-full bg-cyan-200/10 px-2.5 py-1 text-xs font-medium text-cyan-100 capitalize">
                          {c.likelihood}
                        </span>
                      </div>
                      {c.description && (
                        <p className="mt-2 text-sm text-slate-400">{c.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 px-5 py-4">
              <p className="text-xs font-semibold text-amber-300 uppercase">Disclaimer</p>
              <p className="mt-1 text-sm text-slate-300">{analysis.disclaimer}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/patient/triage"
                className="rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-[#06111d] hover:bg-white transition"
              >
                View triage history
              </a>
              <button
                type="button"
                onClick={() => {
                  setAnalysis(null);
                  setSymptoms("");
                }}
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition"
              >
                New assessment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
