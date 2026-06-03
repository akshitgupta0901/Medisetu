import GlassCard from "./glasscard";

export default function SymptomChecker() {
  return (
    <GlassCard className="h-full p-5 md:p-6 space-y-5 flex flex-col justify-between transition duration-300 hover:border-[#67e8f9]/40 hover:shadow-xl hover:shadow-cyan-950/20">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Check a Symptom
        </h2>

        <span className="text-teal-300 text-2xl">
          🧠
        </span>
      </div>

      <textarea
        className="w-full min-h-[200px] md:min-h-[240px] bg-slate-900 border border-slate-800 rounded-2xl p-5 outline-none focus:border-teal-300 resize-none flex-1 text-base md:text-lg"
        placeholder="Describe your symptoms here..."
      />

      <button className="w-full mt-auto bg-teal-300 text-slate-950 font-extrabold text-lg md:text-xl py-5 rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.25)] hover:bg-teal-200 transition">
        Get AI Assessment
      </button>

    </GlassCard>
  );
}
