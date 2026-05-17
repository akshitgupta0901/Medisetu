const stats = [
  {
    value: "10k+",
    label: "Patients supported",
    detail: "Across assisted care journeys",
  },
  {
    value: "98.4%",
    label: "Triage precision",
    detail: "Model-guided clinical routing",
  },
  {
    value: "24/7",
    label: "Care availability",
    detail: "Always-on telehealth access",
  },
  {
    value: "150+",
    label: "Health hubs",
    detail: "Built for distributed regions",
  },
];

export default function Stats() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden border-y border-white/10 bg-[#07131f] px-6 py-12 sm:px-8 lg:px-16"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.07),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[0.06]"
            >
              <div className="mb-5 h-px w-12 bg-gradient-to-r from-cyan-200 to-blue-400 transition duration-300 group-hover:w-20" />
              <h2 className="text-4xl font-semibold tracking-tight text-white">
                {stat.value}
              </h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
                {stat.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
