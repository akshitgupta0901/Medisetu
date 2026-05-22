export default function RiskAssessment() {
    return (
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">
          Risk Assessment
        </h3>
  
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-slate-400">
                Cardiac
              </span>
  
              <span className="text-xs text-red-400 font-bold">
                High
              </span>
            </div>
  
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-red-500" />
            </div>
          </div>
  
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-slate-400">
                Respiratory
              </span>
  
              <span className="text-xs text-emerald-400 font-bold">
                Low
              </span>
            </div>
  
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[20%] bg-emerald-500" />
            </div>
          </div>
        </div>
      </section>
    );
  }