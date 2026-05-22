"use client";

export default function AIRecommendation() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-teal-500/30
        bg-gradient-to-br
        from-teal-500/10
        to-transparent
        p-6
      "
    >
      <div className="flex items-center gap-2 mb-4">
        <span>✨</span>

        <span className="text-teal-400 text-sm font-bold uppercase">
          AI Recommendation
        </span>
      </div>

      <h4 className="text-white font-semibold">
        Update protocol for Bed 04
      </h4>

      <p className="text-slate-400 text-sm mt-2">
        Based on current vitals and AI risk analysis.
      </p>
    </div>
  );
}