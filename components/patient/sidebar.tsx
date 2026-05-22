"use client";

import Link from "next/link";
import SidebarUserCard from "@/components/auth/sidebar-user-card";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-[#1d2022] border-r border-[#1E5128] flex-col z-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#86db70]">MediSetu AI</h1>
        <p className="text-xs uppercase tracking-widest text-[#c5c6cd] mt-2">
          Clinical Excellence
        </p>
      </div>

      <nav className="px-6 space-y-2">
        <Link
          href="/patient"
          className="block bg-[#0b6302] text-[#89de73] px-4 py-3 rounded-xl"
        >
          Dashboard
        </Link>
        <Link
          href="/patient/profile"
          className="block px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition"
        >
          Medical Profile
        </Link>
        <Link
          href="/ai-triage"
          className="block px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition"
        >
          AI Symptom Check
        </Link>
        <Link
          href="/patient#appointments"
          className="block px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition"
        >
          Appointments
        </Link>
      </nav>

      <div className="mt-auto p-8 border-t border-[#1E5128]">
        <SidebarUserCard variant="green" />
      </div>
    </aside>
  );
}
