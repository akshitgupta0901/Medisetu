import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full lg:hidden bg-slate-950 border-t border-slate-800 flex justify-around py-4 z-50">
      <Link href="/patient" className="text-teal-400 text-xs font-bold">
        Home
      </Link>

      <Link href="/patient/triage" className="text-slate-400 text-xs hover:text-teal-400">
        Triage
      </Link>

      <Link href="/patient#appointments" className="text-slate-400 text-xs hover:text-teal-400">
        Book
      </Link>

      <Link href="/patient/lab-results" className="text-slate-400 text-xs hover:text-teal-400">
        Reports
      </Link>

      <Link href="/patient/settings" className="text-slate-400 text-xs hover:text-teal-400">
        Settings
      </Link>
    </nav>
  );
}
