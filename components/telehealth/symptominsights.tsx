export default function SymptomInsights() {
    return (
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">
          Symptom Insights
        </h3>
  
        <div className="space-y-3">
          <div className="bg-slate-900 border border-teal-500/20 rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold text-teal-300">
                  Angina Pectoris
                </h4>
  
                <p className="text-xs text-slate-500">
                  Primary Match
                </p>
              </div>
  
              <div className="text-right">
                <p className="font-bold text-teal-300">
                  92%
                </p>
  
                <p className="text-xs text-slate-500">
                  Confidence
                </p>
              </div>
            </div>
          </div>
  
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold text-slate-300">
                  GERD
                </h4>
  
                <p className="text-xs text-slate-500">
                  Differential Diagnosis
                </p>
              </div>
  
              <div className="text-right">
                <p className="font-bold text-slate-300">
                  45%
                </p>
  
                <p className="text-xs text-slate-500">
                  Confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }