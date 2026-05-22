"use client";

import { useAuth } from "@/contexts/auth-context";
import { getWelcomeMessage } from "@/lib/user-display";

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {user ? getWelcomeMessage(user) : "Welcome"}
          </h2>
          <p className="text-slate-400 text-sm">
            {user?.email ?? "MediSetu clinical workspace"}
          </p>
        </div>

        <button type="button" className="relative" aria-label="Notifications">
          <span className="text-2xl">🔔</span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
