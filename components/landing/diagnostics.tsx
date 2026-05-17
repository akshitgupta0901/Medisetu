function SignalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path
        d="M4 12h3l2.1-5 4 10 2.1-5H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path
        d="M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 8v4l-5 4M12 12l5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path
        d="M12 3 5.5 5.4v5.1c0 4.2 2.6 8 6.5 9.5 3.9-1.5 6.5-5.3 6.5-9.5V5.4L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.8 1.8 3.7-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features = [
  {
    title: "Clinical-grade AI triage",
    description:
      "Structured symptom intake, vitals context, and risk scoring help care teams prioritize the right escalation path faster.",
    metric: "4.6x",
    metricLabel: "faster intake",
    icon: SignalIcon,
  },
  {
    title: "Distributed care network",
    description:
      "Low-bandwidth workflows connect rural health hubs, remote physicians, and specialist reviewers in one guided system.",
    metric: "150+",
    metricLabel: "care hubs",
    icon: NetworkIcon,
  },
  {
    title: "Secure patient intelligence",
    description:
      "Privacy-aware records, consent-led access, and encrypted handoffs keep sensitive medical data protected by default.",
    metric: "24/7",
    metricLabel: "protected access",
    icon: ShieldIcon,
  },
];

const workflow = ["Capture", "Interpret", "Route", "Follow up"];

export default function Diagnostics() {
  return (
    <section
      id="diagnostics"
      className="relative overflow-hidden bg-[#06111d] px-6 py-24 sm:px-8 lg:px-16 lg:py-28"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(90deg,rgba(59,130,246,0.05),transparent,rgba(45,212,191,0.06))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.05),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/65">
              Diagnostic intelligence
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              A clinical operating layer for assisted healthcare delivery.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              MediSetu gives frontline teams a calm, guided interface for
              collecting symptoms, interpreting risk, and coordinating doctor
              review without overwhelming the patient journey.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-3 shadow-lg shadow-black/15">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#071827]/80 p-2 sm:grid-cols-4">
              {workflow.map((step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3"
                >
                  <p className="text-xs font-semibold text-cyan-100">
                    0{index + 1}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                id={feature.title.includes("Secure") ? "security" : undefined}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[0.065] sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/10 text-cyan-100">
                  <Icon />
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#06131f]/80 p-4">
                  <p className="text-3xl font-semibold text-white">
                    {feature.metric}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/55">
                    {feature.metricLabel}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
