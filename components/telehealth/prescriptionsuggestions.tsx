export default function PrescriptionSuggestions() {
    return (
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">
          Suggested Prescriptions
        </h3>
  
        <div className="space-y-3">
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-teal-300">
                Nitroglycerin 0.4mg
              </h4>
  
              <p className="text-xs text-slate-500">
                Sublingual • PRN
              </p>
            </div>
  
            <button className="w-8 h-8 rounded-lg bg-teal-500/20 hover:bg-teal-500/30">
              +
            </button>
          </div>
  
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-300">
                Aspirin 81mg
              </h4>
  
              <p className="text-xs text-slate-500">
                Oral • Daily
              </p>
            </div>
  
            <button className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700">
              +
            </button>
          </div>
        </div>
      </section>
    );
  }