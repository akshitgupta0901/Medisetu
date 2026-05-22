export default function LiveTranscription() {
    return (
      <section>
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">
          Live Transcription
        </h3>
  
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex gap-2">
            <span className="text-teal-400 font-bold">
              14:02
            </span>
  
            <p className="text-sm text-slate-300">
              The pain started about two days ago after dinner.
            </p>
          </div>
  
          <div className="flex gap-2">
            <span className="text-teal-400 font-bold">
              14:03
            </span>
  
            <p className="text-sm text-slate-300">
              It feels like pressure in the center of my chest.
            </p>
          </div>
  
          <div className="flex gap-2">
            <span className="text-teal-400 font-bold">
              14:04
            </span>
  
            <p className="text-sm text-slate-300">
              I also felt dizzy while standing up.
            </p>
          </div>
        </div>
      </section>
    );
  }