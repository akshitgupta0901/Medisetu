"use client";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome Back Doctor
          </h2>

          <p className="text-slate-400 text-sm">
            AI processed 42 patient cases today
          </p>
        </div>

        <button className="relative">
          <span className="text-2xl">🔔</span>

          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}