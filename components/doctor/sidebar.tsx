"use client";

import Link from "next/link";
import SidebarUserCard from "@/components/auth/sidebar-user-card";
import LogoutButton from "@/components/auth/logout-button";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/doctor" },
  { label: "Manage Appointments", href: "/doctor/appointments" },
  { label: "Patient Records", href: "/doctor#patient-records" },
  { label: "Patient Queue", href: "/doctor#patient-queue" },
  { label: "AI Triage Reports", href: "/doctor/ai-reports" },
  { label: "Live Consultations", href: "/telehealth" },
  { label: "Analytics", href: "/doctor/analytics" },
  { label: "Professional Profile", href: "/doctor/profile" },
  { label: "Prescriptions", href: "/prescriptions" },
  { label: "Settings", href: "/doctor/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">MediSetu AI</h1>

        <div className="mt-6">
          <SidebarUserCard />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`block rounded-lg px-4 py-3 text-sm transition ${
              pathname === item.href
                ? "bg-teal-500/15 text-teal-400 border border-teal-500/20"
                : "text-slate-300 hover:bg-slate-800 hover:text-teal-400"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
