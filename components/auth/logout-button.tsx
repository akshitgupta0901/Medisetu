"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex flex-col gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg animate-in fade-in zoom-in duration-200">
        <p className="text-xs text-slate-300 font-medium px-2">Are you sure?</p>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1 transition"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Logout"}
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs py-1.5 rounded transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition text-sm py-2 px-4 rounded-lg hover:bg-slate-900 w-full"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
