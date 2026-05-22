"use client";

import Link from "next/link";
import SidebarUserCard from "@/components/auth/sidebar-user-card";
import LogoutButton from "@/components/auth/logout-button";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "User Management", href: "/admin/users" },
  { label: "Doctors", href: "/admin/users?role=doctor" },
  { label: "Patients", href: "/admin/users?role=patient" },
  { label: "Appointments", href: "/coming-soon?feature=Appointments" },
  { label: "Consultations", href: "/coming-soon?feature=Consultations" },
  { label: "Billing", href: "/coming-soon?feature=Billing" },
  { label: "Analytics", href: "/coming-soon?feature=Analytics" },
  { label: "Compliance", href: "/coming-soon?feature=Compliance" },
  { label: "Settings", href: "/coming-soon?feature=Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex-col z-40">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">MediSetu AI</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Admin Console
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

      <div className="p-4 border-t border-slate-800">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase">Facility</p>
          <p className="text-sm font-semibold text-white mt-1">MediSetu Network</p>
          <p className="text-xs text-teal-400 mt-2">HIPAA Compliant · Tier 1</p>
        </div>
      </div>
    </aside>
  );
}
