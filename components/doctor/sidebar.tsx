"use client";

import Link from "next/link";
import SidebarUserCard from "@/components/auth/sidebar-user-card";

const items = [
  "Dashboard",
  "Patient Queue",
  "Live Consultations",
  "AI Reports",
  "Prescriptions",
  "Analytics",
  "Settings",
];

const hrefMap: Record<string, string> = {
  Dashboard: "/doctor",
  "Patient Queue": "/doctor",
  "Live Consultations": "/telehealth",
  "AI Reports": "#",
  Prescriptions: "/prescriptions",
  Analytics: "#",
  Settings: "#",
};

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">MediSetu AI</h1>

        <div className="mt-6">
          <SidebarUserCard />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/doctor#patient-records"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition"
        >
          Patient Records
        </Link>
        {items.map((item) => (
          <Link
            key={item}
            href={hrefMap[item] ?? "#"}
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition"
          >
            {item}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
