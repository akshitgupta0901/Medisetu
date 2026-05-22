"use client";

import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/admin", active: true },
  { label: "Doctors", href: "#doctors" },
  { label: "Patients", href: "#patients" },
  { label: "Consultations", href: "#" },
  { label: "Billing", href: "#" },
  { label: "Analytics", href: "#" },
  { label: "Compliance", href: "#" },
  { label: "Settings", href: "#" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex-col z-40">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">MediSetu AI</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Admin Console
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-lg">
            🛡️
          </div>
          <div>
            <p className="font-semibold text-white">Priya Nair</p>
            <p className="text-xs text-slate-400">System Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`block rounded-lg px-4 py-3 text-sm transition ${
              item.active
                ? "bg-teal-500/15 text-teal-400 border border-teal-500/20"
                : "text-slate-300 hover:bg-slate-800 hover:text-teal-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase">Facility</p>
          <p className="text-sm font-semibold text-white mt-1">
            Metro General Hospital
          </p>
          <p className="text-xs text-teal-400 mt-2">HIPAA Compliant · Tier 1</p>
        </div>
      </div>
    </aside>
  );
}
