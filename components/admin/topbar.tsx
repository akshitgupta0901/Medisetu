"use client";

import { useAuth } from "@/contexts/auth-context";
import { getWelcomeMessage } from "@/lib/user-display";
import NotificationBell from "@/components/notifications/notification-bell";

export default function Topbar() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {user ? getWelcomeMessage(user) : "Admin Dashboard"}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">{today}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 truncate max-w-[180px]">
              {user?.email ?? "All systems operational"}
            </span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition"
          >
            Export Report
          </button>

          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
