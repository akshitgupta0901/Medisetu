"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type {
  RegisterSuccessResponse,
  AuthErrorResponse,
  UserRole,
} from "@/types/auth";

type Step = "details" | "verify";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [specialization, setSpecialization] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOtpHint(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "register" }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Failed to send verification code");
        return;
      }

      setOtpHint(data.message);
      if (data.devMode) {
        setOtpHint("Development mode: check your terminal/console for the OTP code.");
      }
      setStep("verify");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          otp,
          ...(role === "doctor" && specialization.trim()
            ? { specialization: specialization.trim() }
            : {}),
        }),
      });

      const data = (await res.json()) as
        | RegisterSuccessResponse
        | AuthErrorResponse;

      if (!res.ok || !data.success) {
        setError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      setSuccess(data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400 mb-8">
          {step === "details"
            ? "Join MediSetu — verify your email to continue"
            : "Enter the 6-digit code sent to your email"}
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {otpHint && step === "verify" && (
          <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-4 py-3 text-sm text-teal-300">
            {otpHint}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-4 py-3 text-sm text-teal-300">
            {success} Redirecting to login...
          </div>
        )}

        {step === "details" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            {role === "doctor" && (
              <input
                type="text"
                placeholder="Specialization (e.g. Cardiology)"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 text-slate-950 py-3 rounded-xl font-semibold hover:bg-teal-400 transition disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-sm text-slate-400">
              Code sent to <span className="text-white">{email}</span>
            </p>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-center text-2xl tracking-[0.5em] disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-teal-500 text-slate-950 py-3 rounded-xl font-semibold hover:bg-teal-400 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Verify & Register"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setStep("details")}
              className="w-full text-sm text-slate-400 hover:text-teal-400"
            >
              ← Back to details
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-400 hover:text-teal-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
