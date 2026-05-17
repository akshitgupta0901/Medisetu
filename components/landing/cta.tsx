export default function CTA() {
  return (
    <section
      id="consult"
      className="relative overflow-hidden bg-[#06111d] px-6 py-24 sm:px-8 lg:px-16"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] px-6 py-14 text-center shadow-xl shadow-black/20 sm:px-10 md:py-20 lg:px-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,212,191,0.12),transparent_34%,rgba(59,130,246,0.12)_100%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/50 to-transparent" />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
            Deploy MediSetu
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Bring specialist-grade guidance closer to every patient.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Launch AI-assisted triage, doctor routing, and follow-up workflows
            across clinics, mobile health teams, and rural care programs.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-cyan-200 px-8 py-4 text-sm font-semibold text-[#06111d] shadow-lg shadow-cyan-500/15 transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07131f]"
            >
              Start free consultation
            </a>

            <a
              href="#diagnostics"
              className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.035] px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
            >
              Explore care network
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
