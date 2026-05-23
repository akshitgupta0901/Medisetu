const navItems = [
  { label: "Platform", href: "#diagnostics" },
  { label: "Impact", href: "#impact" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#07131f]/95 px-4 shadow-lg shadow-cyan-950/15 sm:h-[72px] sm:px-6">
        <a
          href="#"
          aria-label="MediSetu home"
          className="group flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 shadow-lg shadow-cyan-500/10 transition duration-300 group-hover:border-cyan-200/50 group-hover:bg-cyan-300/15">
            <span className="relative h-5 w-5">
              <span className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-cyan-200" />
              <span className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-cyan-200" />
            </span>
          </span>

          <span className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              MediSetu
            </span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-100/55 sm:block">
              Clinical AI
            </span>
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition duration-300 hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:inline-flex"
          >
            Sign in
          </a>

          <a
            href="/role-select"
            className="inline-flex items-center justify-center rounded-full bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#07131f] shadow-md shadow-cyan-500/15 transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07131f] sm:px-5"
          >
            Start triage
          </a>
        </div>
      </div>
    </header>
  );
}
