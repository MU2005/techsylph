"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, FileText, PackageCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Share Your Requirement",
    desc: "Send your product needs, target quantity, and customization details through RFQ or contact form.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Get Quote in 24 Hours",
    desc: "We reply with factory-direct pricing, sample plan, and timeline so you can decide quickly.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Sample, Produce, Deliver",
    desc: "Approve your sample, confirm the order, and we handle production, QC, and door-to-door shipment.",
  },
];

const ROTATE_INTERVAL_MS = 2800;

export default function HowItWorksMini() {
  const t = useTranslations("howItWorks");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, ROTATE_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReducedMotion, paused]);

  const handleDotClick = (i: number) => {
    setActiveIndex(i);
    setPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => setPaused(false), ROTATE_INTERVAL_MS * 2);
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
          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Steps">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => handleDotClick(i)}
                className={`h-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-300`}
                aria-label={`Go to step ${i + 1}`}
              >
                <span className={`block h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-emerald-600" : "w-2 bg-surface-3 hover:bg-emerald-200"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
