import GlassCard from "./glasscard";

export default function LocalSupport() {
  return (
    <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-[teal-400]">

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-[teal-400]/10 flex items-center justify-center text-[teal-400]">
          ☎
        </div>

        <p className="text-sm text-[slate-400]">
          <span className="text-white font-semibold">
            Local Support:
          </span>
          {" "}
          Your health worker Ravi is available for offline assistance.
        </p>

      </div>

      <a href="mailto:support@medisetu.com" className="border border-teal-400/30 text-teal-400 px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-teal-400/10 transition">
        Contact Support
      </a>

    </GlassCard>
  );
}