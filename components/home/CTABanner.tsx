"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CTABanner() {
  const t = useTranslations("ctaBanner");
  return (
    <section className="relative py-20 md:py-28">
      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className={cn(
            "relative overflow-hidden rounded-2xl shadow-2xl",
            "bg-[linear-gradient(135deg,#047857_0%,#059669_25%,#0d9488_50%,#059669_75%,#047857_100%)]",
            "px-8 py-14 md:px-14 md:py-16"
          )}
        >
          {/* Top accent line */}
          <div
            className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            aria-hidden
          />

          <div className="flex flex-col items-center text-center">
            <motion.p
              variants={item}
              className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
            >
              {t("overline")}
            </motion.p>
            <motion.h2
              variants={item}
              className="mt-4 font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
            >
              {t("title1")}
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {t("title2")}
              </span>
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-5 max-w-xl font-body text-base leading-relaxed text-white/75 md:text-lg"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/rfq"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-body text-base font-semibold text-emerald-800 shadow-lg transition-all duration-200",
                  "hover:bg-white/95 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {t("cta1")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/catalog"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl border-2 border-white/40 bg-transparent px-7 py-3.5 font-body text-base font-semibold text-white transition-all duration-200",
                  "hover:border-white/60 hover:bg-white/10"
                )}
              >
                {t("cta2")}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
