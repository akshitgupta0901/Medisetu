"use client";

import Link from "next/link";

const items = [
  "Dashboard",
  "Patient Queue",
  "Live Consultations",
  "AI Reports",
  "Prescriptions",
  "Analytics",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">
          MediSetu AI
        </h1>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center">
            👨‍⚕️
          </div>

          <div>
            <p className="font-semibold text-white">
              Dr. Vance
            </p>

            <p className="text-xs text-slate-400">
              Cardiologist
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item}
            href="#"
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition"
          >
            {item}
          </Link>
        ))}
      </nav>
    </aside>
  );
}