"use client";

import { useAuth } from "@/contexts/auth-context";
import { getWelcomeMessage } from "@/lib/user-display";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-18rem)] h-20 bg-[#101415]/80 backdrop-blur-xl border-b border-[#1E5128] flex items-center justify-between px-4 lg:px-10 z-40">
      <h2 className="text-xl md:text-2xl font-bold text-[#bac7e1] truncate">
        {user ? getWelcomeMessage(user) : "Patient Dashboard"}
      </h2>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-[#272a2c] flex items-center justify-center hover:bg-[#323537] transition"
          aria-label="Notifications"
        >
          🔔
        </button>
      </div>
    </header>
  );
}
