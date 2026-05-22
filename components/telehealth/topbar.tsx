"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import UserAvatar from "@/components/auth/user-avatar";
import { getShortId } from "@/lib/user-display";

export default function TopBar() {
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800"
    >
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {user ? (
            <UserAvatar user={user} size="sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-teal-500/20" />
          )}

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-teal-400 truncate">
              Clinical Session
            </h1>
            <p className="text-xs text-slate-400 truncate">
              {user
                ? `${user.name} · ID: ${getShortId(user._id)}`
                : "MediSetu Telehealth"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-2 rounded-full hover:bg-slate-800 transition"
          aria-label="Session options"
        >
          ⋮
        </button>
      </div>
    </motion.header>
  );
}
