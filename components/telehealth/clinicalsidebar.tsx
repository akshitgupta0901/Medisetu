"use client";

import LiveTranscription from "./livetranscription";
import RiskAssessment from "./riskassessment";
import SymptomInsights from "./symptominsights";
import PrescriptionSuggestions from "./prescriptionsuggestions";

export default function ClinicalSidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        h-full
        w-12
        hover:w-80
        group
        transition-all
        duration-300
        z-40
        overflow-hidden
      "
    >
      <div
        className="
          h-full
          w-80
          bg-slate-950/95
          backdrop-blur-xl
          border-r
          border-slate-800
          transform
          -translate-x-full
          group-hover:translate-x-0
          transition-transform
          duration-300
          pt-16
          flex
          flex-col
        "
      >
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-teal-400">
            AI Clinical Workspace
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <LiveTranscription />
          <RiskAssessment />
          <SymptomInsights />
          <PrescriptionSuggestions />
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
              🤖
            </div>

            <div>
              <p className="text-sm text-white">
                Clinical Assistant
              </p>

              <p className="text-xs text-teal-400 uppercase">
                AI Protocol Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}