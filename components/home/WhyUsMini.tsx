"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, Layers } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnimatedLine } from "@/components/shared/ScrollAnimations";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    desc: "Every garment passes multi-point QC inspection before shipment. We meet international export standards consistently.",
  },
  {
    icon: Globe,
    title: "Global Export Ready",
    desc: "Experienced in shipping to US, EU, Middle East & beyond. Full documentation, compliance, and logistics support.",
  },
  {
    icon: Layers,
    title: "Low MOQ, High Flexibility",
    desc: "Start from 50 pieces per style. Scale up as your business grows. Custom sizing, colors, and labeling available.",
  },
];

const ROTATE_INTERVAL_MS = 2800;

export default function WhyUsMini() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, ROTATE_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDotClick = (i: number) => {
    setActiveIndex(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, ROTATE_INTERVAL_MS);
  };

  const f = FEATURES[activeIndex];
  const Icon = f.icon;

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Built for Global"
          highlight="B2B Buyers"
          centered
        />
        <div className="mx-auto mt-6 max-w-2xl">
          <AnimatedLine
            direction="horizontal"
            className="h-px w-full bg-gray-400"
            origin="center"
          />
        </div>

        {/* Desktop / large: original 3-card grid */}
        <div className="mt-12 hidden grid-cols-1 gap-8 md:grid md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glow-card-subtle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="glow-card-inner p-6 text-center">
                <div className="icon-box mx-auto">
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-text-primary">
                  {f.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small screens: carousel */}
        <div className="mt-12 overflow-hidden md:hidden">
          <div className="relative flex justify-center min-h-[240px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                className="carousel-card mx-auto w-full max-w-md"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="carousel-card-inner p-6 text-center">
                  <div className="icon-box mx-auto">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-text-primary">
                    {f.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex justify-center gap-2" aria-hidden>
            {FEATURES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-emerald-600" : "w-2 bg-surface-3 hover:bg-emerald-200"
                }`}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
