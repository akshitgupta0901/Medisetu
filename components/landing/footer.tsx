const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Diagnostics", href: "#diagnostics" },
      { label: "Telehealth", href: "#consult" },
      { label: "Care network", href: "#impact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040b13] px-6 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <a href="#" aria-label="MediSetu home" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
              <span className="relative h-5 w-5">
                <span className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-cyan-200" />
                <span className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-cyan-200" />
              </span>
            </span>
            <span className="text-2xl font-semibold tracking-tight text-white">
              MediSetu
            </span>
          </a>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            Premium AI healthcare infrastructure for guided triage, secure
            patient intelligence, and faster specialist access across connected
            care networks.
          </p>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
            Clinical AI for modern access programs
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:gap-16">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100/60">
                {group.title}
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-slate-400 transition duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 MediSetu. All rights reserved.</p>
        <p>Built for privacy-first healthcare delivery.</p>
      </div>
    </footer>
  );
}
