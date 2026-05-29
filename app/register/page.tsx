"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type {
  RegisterSuccessResponse,
  AuthErrorResponse,
  UserRole,
} from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        setLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting to login...");

      setTimeout(() => router.push("/login"), 1000);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400 mb-8">
          Join MediSetu
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-4 py-3 text-sm text-teal-300">
            {success} Redirecting...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

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
