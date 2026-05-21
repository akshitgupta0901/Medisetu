"use client";

export default function MobileNav() {
  return (
    <nav
      className="
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-slate-950/90
        backdrop-blur-xl
        border-t
        border-slate-800
      "
    >
      <div className="grid grid-cols-4 py-3">
        <button className="flex flex-col items-center text-slate-400 hover:text-teal-400 transition">
          <span>🏠</span>
          <span className="text-[10px] mt-1">
            Home
          </span>
        </button>

        <button className="flex flex-col items-center text-teal-400">
          <span>👥</span>
          <span className="text-[10px] mt-1">
            Patients
          </span>
        </button>

        <button className="flex flex-col items-center text-slate-400 hover:text-teal-400 transition">
          <span>🚨</span>
          <span className="text-[10px] mt-1">
            Alerts
          </span>
        </button>

        <button className="flex flex-col items-center text-slate-400 hover:text-teal-400 transition">
          <span>👤</span>
          <span className="text-[10px] mt-1">
            Account
          </span>
        </button>
      </div>
    </nav>
  );
}