"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "500+", label: "Products Available" },
  { value: "20+", label: "Countries Served" },
  { value: "50 pcs", label: "Minimum Order Qty" },
  { value: "4 Weeks", label: "Avg. Turnaround Time" },
];

export default function StatsBar() {
  return (
    <section className="gradient-bg">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`text-center ${i > 0 ? "md:border-l md:border-white/20 md:pl-8" : ""}`}
            >
              <p className="font-display text-3xl font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-1 font-body text-sm text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
