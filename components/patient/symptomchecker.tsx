import GlassCard from "./glasscard";

export default function SymptomChecker() {
  return (
    <GlassCard className="md:col-span-7 p-8 space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Check a Symptom
        </h2>

        <span className="text-teal-300 text-2xl">
          🧠
        </span>
      </div>

      <textarea
        className="w-full min-h-[160px] bg-slate-900 border border-slate-800 rounded-2xl p-5 outline-none focus:border-teal-300"
        placeholder="Describe your symptoms here..."
      />

      <button className="w-full bg-teal-300 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-teal-500/15 hover:bg-teal-200 transition">
        Get AI Assessment
      </button>

    </GlassCard>
  );
}
