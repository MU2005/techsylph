"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const ROTATE_INTERVAL_MS = 2800;

export default function HowItWorksMini() {
  const t = useTranslations("howItWorks");
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, ROTATE_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDotClick = (i: number) => {
    setActiveIndex(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, ROTATE_INTERVAL_MS);
  };

  const step = STEPS[activeIndex];

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={t("title")}
          highlight={t("highlight")}
          subtitle={t("subtitle")}
          centered
        />

        {/* Desktop / large: original 3-card grid with connector lines */}
        <div className="relative mt-12 hidden grid-cols-1 gap-8 md:grid md:grid-cols-3">
          <div
            className="absolute left-[33.333%] top-1/2 hidden w-1/3 -translate-y-px border-t border-dashed border-surface-3 md:block"
            aria-hidden
          />
          <div
            className="absolute left-[66.666%] top-1/2 hidden w-1/3 -translate-y-px border-t border-dashed border-surface-3 md:block"
            aria-hidden
          />
          {STEPS.map((stepItem, i) => (
            <motion.div
              key={stepItem.number}
              className="glow-card relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="glow-card-inner relative px-8 pt-14 pb-10 text-center">
                <span
                  className="absolute right-6 top-6 box-border pr-2 pt-1 font-display text-5xl font-bold leading-none text-text-primary/[0.12]"
                  aria-hidden
                >
                  {stepItem.number}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">
                  {stepItem.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
                  {stepItem.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small screens: carousel */}
        <div className="mt-12 overflow-hidden md:hidden">
          <div className="relative flex justify-center min-h-[260px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                className="carousel-card mx-auto w-full max-w-md"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="carousel-card-inner relative px-8 pt-14 pb-10 text-center">
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
            </AnimatePresence>
          </div>
          <div className="mt-6 flex justify-center gap-2" aria-hidden>
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-emerald-600" : "w-2 bg-surface-3 hover:bg-emerald-200"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
