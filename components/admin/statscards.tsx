"use client";

import { motion } from "framer-motion";

const stats = [
  {
    label: "Registered Patients",
    value: "12,847",
    sub: "+284 this month",
    trend: "↑ 8.2%",
    trendColor: "text-emerald-400",
    icon: "👥",
    border: "border-teal-500/20",
    gradient: "from-slate-900 to-slate-950",
    valueColor: "text-teal-400",
    badge: "Population",
  },
  {
    label: "Active Physicians",
    value: "186",
    sub: "14 on telehealth duty",
    trend: "3 departments understaffed",
    trendColor: "text-amber-400",
    icon: "👨‍⚕️",
    border: "border-blue-500/20",
    gradient: "from-slate-900 to-blue-950/40",
    valueColor: "text-blue-300",
    badge: "Workforce",
  },
  {
    label: "Consultations Today",
    value: "1,024",
    sub: "412 in-person · 612 virtual",
    trend: "↑ 18% vs last Tuesday",
    trendColor: "text-emerald-400",
    icon: "📋",
    border: "border-teal-500/20",
    gradient: "from-slate-900 to-slate-950",
    valueColor: "text-teal-400",
    badge: "Throughput",
  },
  {
    label: "Platform Uptime",
    value: "99.97%",
    sub: "Last incident: 12 days ago",
    trend: "SLA target: 99.9%",
    trendColor: "text-slate-400",
    icon: "⚡",
    border: "border-emerald-500/20",
    gradient: "from-slate-900 to-emerald-950/20",
    valueColor: "text-emerald-400",
    badge: "Reliability",
  },
];

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className={`rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.gradient} p-5 md:p-6 shadow-xl`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {stat.badge}
            </span>
            <span className="text-2xl">{stat.icon}</span>
          </div>

          <p className="text-slate-400 text-xs uppercase">{stat.label}</p>
          <h2 className={`text-3xl md:text-4xl font-bold ${stat.valueColor} mt-2`}>
            {stat.value}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{stat.sub}</p>
          <p className={`mt-4 text-sm ${stat.trendColor}`}>{stat.trend}</p>
        </motion.div>
      ))}
    </section>
  );
}
