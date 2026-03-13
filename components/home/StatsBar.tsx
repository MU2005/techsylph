"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/types/sanity";

interface StatsBarProps {
  settings: SiteSettings | null;
}

const STAT_LABELS = [
  "Products Available",
  "Countries Served",
  "Minimum Order Qty",
  "Avg. Turnaround Time",
];

export default function StatsBar({ settings }: StatsBarProps) {
  const values = [
    settings?.statsProducts ?? "500+",
    settings?.statsCountries ?? "20+",
    settings?.statsMoq ?? "50 pcs",
    settings?.statsTurnaround ?? "4 Weeks",
  ];

  return (
    <section className="gradient-bg">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
          {values.map((value, i) => (
            <motion.div
              key={STAT_LABELS[i]}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`text-center ${i > 0 ? "md:border-l md:border-white/20 md:pl-8" : ""}`}
            >
              <motion.p
                className="font-display text-3xl font-bold text-white"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                  delay: i * 0.12,
                }}
              >
                {value}
              </motion.p>
              <p className="mt-1 font-body text-sm text-white/70">
                {STAT_LABELS[i]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
