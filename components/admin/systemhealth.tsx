"use client";

import { motion } from "framer-motion";

const services = [
  {
    name: "EHR Integration API",
    status: "Healthy",
    latency: "42ms",
    uptime: "99.99%",
    statusColor: "bg-emerald-400",
  },
  {
    name: "AI Triage Engine",
    status: "Healthy",
    latency: "128ms",
    uptime: "99.94%",
    statusColor: "bg-emerald-400",
  },
  {
    name: "Telehealth WebRTC",
    status: "Degraded",
    latency: "340ms",
    uptime: "98.12%",
    statusColor: "bg-amber-400",
  },
  {
    name: "Prescription Gateway",
    status: "Healthy",
    latency: "67ms",
    uptime: "99.98%",
    statusColor: "bg-emerald-400",
  },
  {
    name: "Lab Results Sync",
    status: "Healthy",
    latency: "89ms",
    uptime: "99.96%",
    statusColor: "bg-emerald-400",
  },
];

const metrics = [
  { label: "CPU Load", value: 34, max: 100, color: "bg-teal-500" },
  { label: "Memory", value: 62, max: 100, color: "bg-blue-500" },
  { label: "Storage", value: 71, max: 100, color: "bg-amber-500" },
];

export default function SystemHealth() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20 h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">System Health</h3>
          <p className="text-slate-400 text-sm mt-1">
            Infrastructure · US-East-1 · Last checked 30s ago
          </p>
        </div>
        <span className="text-2xl">🖥️</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl bg-slate-950/60 border border-slate-800 p-3">
            <p className="text-xs text-slate-500 uppercase">{m.label}</p>
            <p className="text-lg font-bold text-white mt-1">{m.value}%</p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${m.color}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`h-2 w-2 rounded-full shrink-0 ${svc.statusColor}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{svc.name}</p>
                <p className="text-xs text-slate-500">
                  {svc.latency} · {svc.uptime} uptime
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-medium shrink-0 ${
                svc.status === "Healthy" ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {svc.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
        <p className="text-amber-400 text-xs font-semibold uppercase">Advisory</p>
        <p className="text-sm text-slate-300 mt-1">
          Telehealth cluster experiencing elevated latency in APAC region. Failover
          routing active.
        </p>
      </div>
    </motion.section>
  );
}
