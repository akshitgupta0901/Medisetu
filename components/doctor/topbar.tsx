"use client";

import { useAuth } from "@/contexts/auth-context";
import { getWelcomeMessage } from "@/lib/user-display";
import NotificationBell from "@/components/notifications/notification-bell";
import VerifiedBadge from "@/components/shared/verified-badge";

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {user ? getWelcomeMessage(user) : "Welcome"}
            </h2>
            {user?.role === "doctor" && user.isVerified && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-slate-400 text-sm">
            {user?.email ?? "MediSetu clinical workspace"}
          </p>
        </div>

        <NotificationBell />
      </div>
    </header>
  );
}
