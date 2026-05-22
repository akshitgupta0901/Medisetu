"use client";

import { motion } from "framer-motion";

const activities = [
  {
    time: "14:32",
    type: "security",
    dot: "bg-teal-400",
    title: "Admin login from verified device",
    detail: "Admin session · verified device",
  },
  {
    time: "14:22",
    type: "clinical",
    dot: "bg-blue-400",
    title: "Lab results synced for Robert Simmons",
    detail: "Cardiology · attending physician notified",
  },
  {
    time: "13:58",
    type: "alert",
    dot: "bg-red-400",
    title: "Critical triage flag raised",
    detail: "Patient PT-88421 · Chest pain protocol",
  },
  {
    time: "13:45",
    type: "billing",
    dot: "bg-slate-400",
    title: "Insurance claim batch processed",
    detail: "412 claims · $284,120 total",
  },
  {
    time: "13:12",
    type: "onboarding",
    dot: "bg-emerald-400",
    title: "New physician credential verified",
    detail: "Dr. Amara Osei · Emergency Medicine",
  },
  {
    time: "12:40",
    type: "system",
    dot: "bg-amber-400",
    title: "Telehealth node auto-scaled",
    detail: "Region: ap-southeast-1 · +2 instances",
  },
];

export default function RecentActivity() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg shadow-black/20 h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <button
          type="button"
          className="text-sm text-teal-400 hover:text-teal-300 transition"
        >
          Audit log →
        </button>
      </div>

      <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
        {activities.map((item) => (
          <div key={`${item.time}-${item.title}`} className="flex gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.dot}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">{item.time}</p>
              <p className="text-sm font-medium text-white mt-0.5">{item.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
        <span>HIPAA audit trail enabled</span>
        <span>Retention: 7 years</span>
      </div>
    </motion.section>
  );
}
