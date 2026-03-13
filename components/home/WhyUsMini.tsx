"use client";

import { motion } from "framer-motion";
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

export default function WhyUsMini() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Why TechSylph"
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
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
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
      </div>
    </section>
  );
}
