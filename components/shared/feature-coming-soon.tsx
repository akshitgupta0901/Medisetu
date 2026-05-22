"use client";

import { Construction } from "lucide-react";

export default function FeatureComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl min-h-[400px]">
      <div className="p-6 bg-teal-500/10 rounded-full mb-6">
        <Construction className="w-12 h-12 text-teal-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md">
        We are working hard to bring this feature to you. Stay tuned for updates!
      </p>
      <button 
        onClick={() => window.history.back()}
        className="mt-8 px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition"
      >
        Go Back
      </button>
    </div>
  );
}
