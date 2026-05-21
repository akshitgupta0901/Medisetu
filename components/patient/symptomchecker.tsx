import GlassCard from "./glasscard";

export default function SymptomChecker() {
  return (
    <GlassCard className="md:col-span-7 p-8 space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Check a Symptom
        </h2>

        <span className="text-[#86db70] text-2xl">
          🧠
        </span>
      </div>

      <textarea
        className="w-full min-h-[160px] bg-[#0d141d] border border-[#1E5128] rounded-2xl p-5 outline-none focus:border-[#86db70]"
        placeholder="Describe your symptoms here..."
      />

      <button className="w-full bg-[#86db70] text-black font-bold py-4 rounded-xl hover:opacity-90 transition">
        Get AI Assessment
      </button>

    </GlassCard>
  );
}