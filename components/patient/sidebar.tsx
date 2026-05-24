"use client";

import Link from "next/link";
import SidebarUserCard from "@/components/auth/sidebar-user-card";
import LogoutButton from "@/components/auth/logout-button";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/patient" },
  { label: "Medical Profile", href: "/patient/profile" },
  { label: "AI Triage", href: "/patient/triage" },
  { label: "Live Consultations", href: "/telehealth" },
  { label: "Appointments", href: "/patient#appointments" },
  { label: "Lab Results", href: "/patient/lab-results" },
  { label: "My Prescriptions", href: "/patient/prescriptions" },
  { label: "Settings", href: "/patient/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex-col z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">MediSetu AI</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Patient Portal
        </p>

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
