"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(href + "/");
    // Handle home specifically so it doesn't always match
    const isExact = href === "/doctor" ? pathname === href : isActive;
    return `flex flex-col items-center ${isExact ? "text-teal-400" : "text-slate-400 hover:text-teal-400 transition-colors"}`;
  };

  return (
    <nav
      className="
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-slate-950
        border-t
        border-slate-800
      "
    >
      <div className="flex justify-around py-3">
        <Link href="/doctor" className={getLinkClasses("/doctor")}>
          <span className="text-xl mb-1">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link href="/doctor/queue" className={getLinkClasses("/doctor/queue")}>
          <span className="text-xl mb-1">👥</span>
          <span className="text-xs font-medium">Queue</span>
        </Link>

        <Link href="/telehealth" className={getLinkClasses("/telehealth")}>
          <span className="text-xl mb-1">📹</span>
          <span className="text-xs font-medium">Live</span>
        </Link>

        <Link href="/doctor/settings" className={getLinkClasses("/doctor/settings")}>
          <span className="text-xl mb-1">⚙️</span>
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </div>
    </nav>
  );
}