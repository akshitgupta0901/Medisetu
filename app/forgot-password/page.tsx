"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { AuthErrorResponse } from "@/types/auth";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHint(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "password_reset" }),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        setError(data.message ?? "Failed to send reset code");
        return;
      }

      setHint(
        data.devMode
          ? "Development mode: check server console for OTP."
          : data.message ?? "If this email is registered, a code has been sent."
      );
      setStep("reset");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Password reset failed");
        return;
      }

      setSuccess(data.message);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-slate-400 mb-8">
          {step === "email"
            ? "We'll email you a verification code"
            : "Enter the code and your new password"}
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {hint && (
          <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-4 py-3 text-sm text-teal-300">
            {hint}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-4 py-3 text-sm text-teal-300">
            {success}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Your account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 text-slate-950 py-3 rounded-xl font-semibold hover:bg-teal-400 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-center text-xl tracking-widest disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-teal-500 text-slate-950 py-3 rounded-xl font-semibold hover:bg-teal-400 transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-slate-400 hover:text-teal-400"
            >
              ← Use different email
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center">
          <Link href="/login" className="text-teal-400 hover:text-teal-300">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
