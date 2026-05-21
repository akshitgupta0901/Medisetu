import GlassCard from "./glasscard";

export default function LocalSupport() {
  return (
    <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-[#86db70]">

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-[#86db70]/10 flex items-center justify-center text-[#86db70]">
          ☎
        </div>

        <p className="text-sm text-[#c5c6cd]">
          <span className="text-white font-semibold">
            Local Support:
          </span>
          {" "}
          Your health worker Ravi is available for offline assistance.
        </p>

      </div>

      <button className="border border-[#86db70]/30 text-[#86db70] px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-[#86db70]/10 transition">
        Contact Ravi
      </button>

    </GlassCard>
  );
}