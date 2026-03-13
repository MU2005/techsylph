"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Testimonial } from "@/types/sanity";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (first + last).toUpperCase();
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="What Our"
          highlight="Buyers Say"
          centered
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => {
            const rating = t.rating ?? 5;
            const roleCompany = [t.role, t.company].filter(Boolean).join(" — ");
            return (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card-base flex flex-col gap-4 p-6"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="size-4 fill-current"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="font-body text-sm leading-relaxed text-text-secondary">
                  &ldquo;{t.quote ?? ""}&rdquo;
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
                    {roleCompany && (
                      <p className="font-body text-xs text-text-muted">
                        {roleCompany}
                      </p>
                    )}
                    {t.country && (
                      <p className="font-body text-xs text-text-muted">
                        {t.country}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
