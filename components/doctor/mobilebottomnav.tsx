"use client";

export default function MobileBottomNav() {
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
        <button className="flex flex-col items-center text-teal-400">
          🏠
          <span className="text-xs">
            Home
          </span>
        </button>

        <button className="flex flex-col items-center text-slate-400">
          👥
          <span className="text-xs">
            Queue
          </span>
        </button>

        <button className="flex flex-col items-center text-slate-400">
          📹
          <span className="text-xs">
            Live
          </span>
        </button>

        <button className="flex flex-col items-center text-slate-400">
          ⚙️
          <span className="text-xs">
            Settings
          </span>
        </button>
      </div>
    </nav>
  );
}