"use client";

import Link from "next/link";
import SidebarUserCard from "@/components/auth/sidebar-user-card";
import LogoutButton from "@/components/auth/logout-button";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/patient" },
  { label: "Medical Profile", href: "/patient/profile" },
  { label: "AI Symptom Check", href: "/ai-triage" },
  { label: "Appointments", href: "/patient#appointments" },
  { label: "Lab Results", href: "/coming-soon?feature=Lab Results" },
  { label: "My Prescriptions", href: "/coming-soon?feature=Prescriptions" },
  { label: "Settings", href: "/coming-soon?feature=Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-[#1d2022] border-r border-[#1E5128] flex-col z-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#86db70]">MediSetu AI</h1>
        <p className="text-xs uppercase tracking-widest text-[#c5c6cd] mt-2">
          Clinical Excellence
        </p>
      </div>

      <nav className="px-6 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`block px-4 py-3 rounded-xl transition ${
              pathname === item.href
                ? "bg-[#0b6302] text-[#89de73]"
                : "text-[#c5c6cd] hover:bg-[#323537]"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-[#1E5128]">
          <LogoutButton />
        </div>
      </nav>

      <div className="mt-auto p-8 border-t border-[#1E5128]">
        <SidebarUserCard variant="green" />
      </div>
    </aside>
  );
}
