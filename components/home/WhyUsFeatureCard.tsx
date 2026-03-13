"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingDown,
  Globe,
  Palette,
  Timer,
  HeadphonesIcon,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  TrendingDown,
  Globe,
  Palette,
  Timer,
  HeadphonesIcon,
};

type Feature = {
  num: string;
  icon: string;
  title: string;
  desc: string;
  stat: string;
};

/** Column in a 3-col grid: 0 = left, 1 = middle, 2 = right. */
function getColumnAnimation(index: number) {
  const col = index % 3;
  if (col === 0) {
    return { initial: { opacity: 0, x: -56 }, whileInView: { opacity: 1, x: 0 } };
  }
  if (col === 1) {
    return { initial: { opacity: 0, y: -40 }, whileInView: { opacity: 1, y: 0 } };
  }
  return { initial: { opacity: 0, x: 56 }, whileInView: { opacity: 1, x: 0 } };
}

export function WhyUsFeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = ICON_MAP[feature.icon] ?? ShieldCheck;
  const animation = getColumnAnimation(index);
  return (
    <motion.div
      className="glow-card-subtle"
      initial={animation.initial}
      whileInView={animation.whileInView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <div className="glow-card-inner relative p-6">
        <span
          className="absolute right-4 top-4 font-display text-6xl text-text-primary/5"
          aria-hidden
        >
          {feature.num}
        </span>
        <div className="gradient-bg flex size-12 items-center justify-center rounded-xl">
          <Icon className="size-6 text-white" />
        </div>
        <h3 className="mt-4 font-display font-bold text-text-primary">{feature.title}</h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
          {feature.desc}
        </p>
        <div className="mt-4 border-t border-surface-border pt-4">
          <p className="font-display text-lg font-bold gradient-text">
            {feature.stat}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
