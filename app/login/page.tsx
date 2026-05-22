"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import type { AuthSuccessResponse, AuthErrorResponse } from "@/types/auth";
import { getRoleDashboardPath } from "@/lib/routes";
import { useAuth } from "@/contexts/auth-context";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, refetch } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const err = searchParams.get("error");
    if (err === "unauthorized") return "You do not have permission to access that page.";
    if (err === "session_expired") return "Your session has expired. Please log in again.";
    return null;
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as AuthSuccessResponse | AuthErrorResponse;

      if (!res.ok || !data.success) {
        const message =
          "message" in data ? data.message : "Login failed. Please try again.";
        setError(message);
        return;
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      await refetch();

      const redirect = searchParams.get("redirect");
      const destination =
        redirect && redirect.startsWith("/")
          ? redirect
          : getRoleDashboardPath(data.user.role);

      router.push(destination);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
        <p className="text-slate-400 mb-8">Welcome back to MediSetu</p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-slate-950 py-3 rounded-xl font-semibold hover:bg-teal-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <Link href="/register" className="text-teal-400 hover:text-teal-300">
            Create Account
          </Link>
          <Link href="/forgot-password" className="text-teal-400 hover:text-teal-300">
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
