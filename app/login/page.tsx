"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Login
        </h1>

        <p className="text-slate-400 mb-8">
          Welcome back to MediSetu
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
          />

          <button
            onClick={() => router.push("/patient")}
            className="w-full bg-teal-500 text-slate-950 py-3 rounded-xl font-semibold hover:bg-teal-400 transition"
          >
            Login
          </button>
        </div>

        <div className="mt-6 flex justify-between text-sm">
          <Link href="/register" className="text-teal-400">
            Create Account
          </Link>

          <Link href="/forgot-password" className="text-teal-400">
            Forgot Password?
          </Link>
        </div>
      </div>
    </main>
  );
}