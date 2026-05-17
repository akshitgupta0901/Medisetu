"use client";

import { motion } from "framer-motion";

const items = [
  { label: "Home", active: false },
  { label: "Triage", active: true },
  { label: "Reports", active: false },
  { label: "Profile", active: false },
];

export default function MobileNav() {
  return (
    <motion.nav
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Mobile triage navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07111d]/95 px-3 py-3 shadow-xl shadow-black/25 lg:hidden"
    >
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex min-h-12 flex-col items-center justify-center rounded-2xl text-xs font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 ${
              item.active
                ? "bg-cyan-200/[0.1] text-cyan-100"
                : "text-slate-500 hover:bg-white/[0.045] hover:text-white"
            }`}
          >
            <span
              className={`mb-1 h-1.5 w-1.5 rounded-full ${
                item.active ? "bg-cyan-200" : "bg-slate-700"
              }`}
            />
            {item.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
