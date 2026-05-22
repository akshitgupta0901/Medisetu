"use client";

export default function BottomNav() {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-slate-900/90
        backdrop-blur-xl
        border-t
        border-slate-800
      "
    >
      <div className="flex items-center justify-around py-3">
        <button className="text-slate-400 hover:text-white transition">
          🎤
          <p className="text-xs mt-1">Mute</p>
        </button>

        <button className="text-slate-400 hover:text-white transition">
          📹
          <p className="text-xs mt-1">Camera</p>
        </button>

        <button className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-full font-semibold">
          Tools
        </button>

        <button className="text-red-400 hover:text-red-300 transition">
          📞
          <p className="text-xs mt-1">End</p>
        </button>
      </div>
    </nav>
  );
}