"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { SiteSettings } from "@/types/sanity";

interface StatsBarProps {
  settings: SiteSettings | null;
}

const STAT_KEYS = ["products", "countries", "moq", "turnaround"] as const;

export default function StatsBar({ settings }: StatsBarProps) {
  const t = useTranslations("stats");
  const values = [
    settings?.statsProducts ?? "500+",
    settings?.statsCountries ?? "20+",
    settings?.statsMoq ?? "50 pcs",
    settings?.statsTurnaround ?? "4 Weeks",
  ];

  const statCell = (value: string, label: string, i: number, variant: "mobile" | "desktop") => (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className={
        variant === "mobile"
          ? `text-center ${i % 2 === 1 ? "border-l border-surface-2" : ""} ${i >= 2 ? "border-t border-surface-2 pt-6" : ""}`
          : `text-center ${i > 0 ? "border-l border-white/20 pl-8" : ""}`
      }
    >
      <motion.p
        className={
          variant === "mobile"
            ? "font-display text-2xl font-bold text-text-primary"
            : "font-display text-3xl font-bold text-white"
        }
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
      <p
        className={
          variant === "mobile"
            ? "mt-0.5 font-body text-xs text-text-muted"
            : "mt-1 font-body text-sm text-white/70"
        }
      >
        {label}
      </p>
    </motion.div>
  );

  return (
    <>
      {/* Mobile: white background, 2x2 grid — no heading, numbers only */}
      <section className="bg-white md:hidden">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6">
            {values.map((value, i) => statCell(value, t(STAT_KEYS[i]), i, "mobile"))}
          </div>
        </div>
      </section>

      {/* Desktop: green gradient, single row — no heading, numbers only */}
      <section className="hidden gradient-bg md:block">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-4 gap-0">
            {values.map((value, i) => statCell(value, t(STAT_KEYS[i]), i, "desktop"))}
          </div>
        </div>
      </section>
    </>
  );
}
