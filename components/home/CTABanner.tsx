"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden section-padding gradient-bg">
      <div
        className="absolute right-0 top-0 size-64 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 size-48 rounded-full bg-white/5 blur-2xl"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-7xl px-6 text-center"
      >
        <p className="font-body text-sm font-semibold uppercase tracking-widest text-white/80">
          Ready to Source?
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
          Start Your Global Export
          <br />
          Journey Today
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-white/80">
          Join hundreds of international buyers sourcing premium apparel from
          Pakistan&apos;s finest manufacturers.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/rfq"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-body font-bold text-brand-green shadow-md transition-colors hover:bg-surface-1"
          >
            Request a Quote
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 px-8 py-4 font-body font-semibold text-white transition-all hover:bg-white/10"
          >
            Browse Catalog
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
