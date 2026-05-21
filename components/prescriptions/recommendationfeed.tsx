"use client";

import { motion } from "framer-motion";
import GlassCard from "./glasscard";

const recommendations = [
  {
    title: "DASH Diet Integration",
    description:
      "Clinical synergy with Lisinopril treatment.",
    icon: "🌿",
  },
  {
    title: "Remote BP Monitoring",
    description:
      "Automated daily blood pressure tracking.",
    icon: "❤️",
  },
];

export default function RecommendationFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-widest text-slate-400">
            Adjunct Therapy Suggestions
          </h3>

          <span className="text-sm text-teal-400">
            2 New Insights
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((item) => (
            <GlassCard
              key={item.title}
              className="
                p-5
                cursor-pointer
                hover:border-teal-500/30
                hover:bg-slate-900
                transition-all
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-teal-500/10
                      flex
                      items-center
                      justify-center
                      text-xl
                    "
                  >
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      {item.title}
                    </h4>

                    <p className="text-sm text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className="text-slate-500">
                  →
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}