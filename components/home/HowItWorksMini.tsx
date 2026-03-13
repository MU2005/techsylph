"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, FileText, PackageCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Inquire",
    desc: "Explore our catalog and submit an inquiry or RFQ form with your requirements.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Get Your Quote",
    desc: "We respond within 48 hours with a custom quote, samples, and production timeline.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Produce & Ship",
    desc: "Approve the sample, confirm the order. We manufacture and ship to your door.",
  },
];

export default function HowItWorksMini() {
  const t = useTranslations("howItWorks");
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          highlight={t("highlight")}
          subtitle={t("subtitle")}
          centered
        />
        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector lines (desktop) */}
          <div
            className="absolute left-[33.333%] top-1/2 hidden w-1/3 -translate-y-px border-t border-dashed border-surface-3 md:block"
            aria-hidden
          />
          <div
            className="absolute left-[66.666%] top-1/2 hidden w-1/3 -translate-y-px border-t border-dashed border-surface-3 md:block"
            aria-hidden
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="glow-card relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="glow-card-inner relative px-8 pt-14 pb-10 text-center">
                {/* Digit: fixed in top-right with its own padding, no overlap */}
                <span
                  className="absolute right-6 top-6 box-border pr-2 pt-1 font-display text-5xl font-bold leading-none text-text-primary/[0.12]"
                  aria-hidden
                >
                  {step.number}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
