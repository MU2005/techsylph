"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const TESTIMONIALS = [
  {
    name: "James Mitchell",
    role: "Retail Buyer, UK",
    text: "TechSylph delivered exactly what we needed — quality hoodies on time, great communication throughout the process.",
    rating: 5,
  },
  {
    name: "Marie Dupont",
    role: "Brand Owner, France",
    text: "Their private label service is exceptional. From sampling to final delivery, every detail was handled professionally.",
    rating: 5,
  },
  {
    name: "Ahmed Al-Rashid",
    role: "Wholesale Distributor, UAE",
    text: "Reliable, affordable, and fast. We've been ordering activewear from TechSylph for two seasons now. Highly recommended.",
    rating: 5,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Client Reviews"
          title="What Our"
          highlight="Buyers Say"
          centered
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card-base flex flex-col gap-4 p-6"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-4 fill-current"
                    aria-hidden
                  />
                ))}
              </div>
              <p className="font-body text-sm leading-relaxed text-text-secondary">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3">
                <div className="gradient-bg flex size-10 shrink-0 items-center justify-center rounded-full">
                  <span className="font-display text-sm font-bold text-white">
                    {getInitials(t.name)}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-text-primary">
                    {t.name}
                  </p>
                  <p className="font-body text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
