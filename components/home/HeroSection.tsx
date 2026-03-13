"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { AnimatedLine } from "@/components/shared/ScrollAnimations";
import type { SiteSettings } from "@/types/sanity";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

interface HeroSectionProps {
  settings: SiteSettings | null;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const t = useTranslations("hero");
  const statsProducts = settings?.statsProducts ?? "500+";
  const statsCountries = settings?.statsCountries ?? "20+";
  const statsMoq = settings?.statsMoq ?? "50 pcs";
  const statsTurnaround = settings?.statsTurnaround ?? "4 Weeks";

  return (
    <section
      className="relative flex min-h-screen items-center bg-white pt-24 md:pt-32"
      style={{
        background: `
          radial-gradient(circle at 20% 50%, #D1FAE5 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #ECFDF5 0%, transparent 40%),
          #FFFFFF
        `,
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left column — text */}
        <div className="flex flex-col">
          {/* Top badge */}
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0 }}
            className="inline-flex w-fit"
          >
            <span className="badge-green">
              <Globe className="mr-1.5 size-3" />
              {t("badge")}
            </span>
          </motion.div>

          {/* Headline — last word or key phrase gradient-text */}
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6"
          >
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-text-primary md:text-6xl lg:text-7xl">
              {t("line1")}
              <br />
              {t("line2")}
              <br />
              <span className="gradient-text">{t("line3")}</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-lg font-body text-lg leading-relaxed text-text-secondary"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <CTAButton href="/rfq" variant="primary" size="lg" className="rounded-xl px-7 py-3.5 text-base shadow-md hover:shadow-lg">
              {t("cta1")}
            </CTAButton>
            <CTAButton href="/catalog" variant="outline" size="lg" className="rounded-xl border-surface-3 px-7 py-3.5 text-base">
              {t("cta2")}
            </CTAButton>
          </motion.div>
        </div>

        {/* Right column — card + floating chips */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex min-h-[400px] items-center justify-center lg:min-h-[500px]"
        >
          {/* Main card — clean white card-highlight */}
          <div className="card-highlight relative w-full max-w-sm p-8 rounded-2xl">
            <p className="font-display font-bold text-text-primary">TechSylph Collection</p>
            <p className="mt-0.5 font-body text-sm text-text-muted">Export Ready — MOQ from {statsMoq}</p>
            <div className="mt-6 space-y-0 border-b border-surface-2 py-3 flex justify-between">
              <span className="font-body text-sm text-text-secondary">Products Available</span>
              <span className="gradient-text font-display font-bold">{statsProducts}</span>
            </div>
            <div className="border-b border-surface-2 py-3 flex justify-between">
              <span className="font-body text-sm text-text-secondary">Countries Served</span>
              <span className="gradient-text font-display font-bold">{statsCountries}</span>
            </div>
            <div className="border-b border-surface-2 py-3 flex justify-between">
              <span className="font-body text-sm text-text-secondary">Avg Turnaround</span>
              <span className="gradient-text font-display font-bold">{statsTurnaround}</span>
            </div>
            <div className="mt-4">
              <span className="badge-green">Custom Private Label Available</span>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            className="card-base absolute left-0 top-8 flex px-3 py-2 text-xs text-text-primary shadow-sm md:left-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            ✓ Quality Guaranteed
          </motion.div>
          <motion.div
            className="card-base absolute bottom-12 right-0 flex px-3 py-2 text-xs text-text-primary shadow-sm md:right-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            🚢 Global Shipping
          </motion.div>
          <motion.div
            className="card-base absolute right-0 top-16 flex px-3 py-2 text-xs text-text-primary shadow-sm md:right-8"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            📦 Low MOQ
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom separator — draws in on scroll */}
      <div className="absolute bottom-0 left-0 right-0 px-6">
        <div className="mx-auto max-w-7xl">
          <AnimatedLine
            direction="horizontal"
            className="h-px w-full"
            origin="center"
            style={{
              background: "linear-gradient(90deg, transparent, #047857, #059669, #10B981, #059669, #047857, transparent)",
            }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <ChevronDown className="size-6 text-text-muted" />
      </motion.div>
    </section>
  );
}
