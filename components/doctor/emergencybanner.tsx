"use client";

export default function EmergencyBanner() {
  return (
    <div className="bg-red-900/30 border-b border-red-500/30">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-red-400 text-xl">
            🚨
          </span>

          <p className="font-semibold text-red-300">
            CRITICAL ALERT: ICU Bed 04 - Tachycardia Detected
          </p>
        </div>

        <button className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-semibold">
          Respond Now
        </button>
      </div>
    </div>
  );
}