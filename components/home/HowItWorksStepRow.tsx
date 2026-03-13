"use client";

import { motion } from "framer-motion";

type Step = {
  title: string;
  desc: string;
  time: string;
};

export function HowItWorksStepRow({ step, index }: { step: Step; index: number }) {
  const stepNum = String(index + 1).padStart(2, "0");
  return (
    <div className="flex gap-6 items-start py-8">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full gradient-bg font-display text-lg font-bold text-white">
        {stepNum}
      </div>
      <motion.div
        className="group glow-card-subtle flex-1"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <div className="glow-card-inner p-6">
          <div
            className="h-1 w-16 rounded-full transition-[width] duration-300 ease-out group-hover:w-32"
            style={{
              background: "linear-gradient(90deg, #047857, #059669, #10B981)",
            }}
            aria-hidden
          />
          <h3 className="mt-4 font-display text-xl font-semibold text-text-primary">
            {step.title}
          </h3>
          <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-text-secondary">
            {step.desc}
          </p>
          <span className="mt-2 inline-block w-fit rounded-full border border-surface-3 bg-surface-2 px-3 py-1 font-body text-xs text-text-muted">
            {step.time}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
