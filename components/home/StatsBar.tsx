"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { SiteSettings } from "@/types/sanity";

interface StatsBarProps {
  settings: SiteSettings | null;
}

const STAT_KEYS = ["products", "countries", "moq", "turnaround"] as const;
const COUNTRY_MARKETS = [
  { code: "us", name: "USA" },
  { code: "gb", name: "UK" },
  { code: "es", name: "Spain" },
  { code: "nl", name: "Netherlands" },
  { code: "au", name: "Australia" },
] as const;

export default function StatsBar({ settings }: StatsBarProps) {
  const t = useTranslations("stats");
  const values = [
    settings?.statsProducts ?? "500+",
    settings?.statsCountries ?? "20+",
    settings?.statsMoq ?? "50 pcs",
    settings?.statsTurnaround ?? "4 Weeks",
  ];

  const statCell = (value: string, label: string, i: number) => (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="rounded-2xl border border-white/20 bg-white/10 px-4 py-6 text-center backdrop-blur-sm"
    >
      <motion.p
        className="font-display text-3xl font-bold text-white md:text-4xl"
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
      <p className="mt-1 font-body text-xs text-white/80 md:text-sm">
        {label}
      </p>
    </motion.div>
  );

  return (
    <section className="relative overflow-hidden gradient-bg">
      <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-emerald-200/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <p className="mb-4 text-center font-body text-sm font-semibold tracking-wide text-white/90 md:text-base">
          {t("marketsHeading")}
        </p>
        <div className="flag-loop" role="region" aria-label="Countries we serve">
          <div className="flag-loop-track flag-loop-track-sway">
            {COUNTRY_MARKETS.map((country) => (
              <div key={country.name} className="flag-chip">
                <img
                  src={`https://flagcdn.com/24x18/${country.code}.png`}
                  alt={`${country.name} flag`}
                  width={24}
                  height={18}
                  loading="lazy"
                  decoding="async"
                  className="h-[18px] w-6 rounded-[2px] object-cover ring-1 ring-emerald-100"
                />
                <span className="font-body text-sm font-semibold text-text-primary">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {values.map((value, i) => statCell(value, t(STAT_KEYS[i]), i))}
        </div>
      </div>
    </section>
  );
}
