"use client";

import { motion } from "framer-motion";
import type { CustomLabelData } from "@/types/sanity";

type ProcessStep = NonNullable<CustomLabelData["process"]>[number];

export function CustomLabelProcess({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="mt-12 space-y-0">
      {steps.map((step, i) => {
        const stepNum = String(step.stepNumber).padStart(2, "0");
        const isEven = i % 2 === 0;
        return (
          <div
            key={step.stepNumber ?? i}
            className={`flex flex-col gap-6 py-8 md:flex-row md:items-start ${
              isEven ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div
              className="flex shrink-0 items-center justify-center md:w-24"
              aria-hidden
            >
              <span className="font-display text-6xl font-black uppercase leading-none text-brand-green/20">
                {stepNum}
              </span>
            </div>
            <motion.div
              className="group glow-card-subtle flex-1"
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
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
                <p className="mt-2 font-body text-text-secondary">
                  {step.description ?? ""}
                </p>
                {step.duration && (
                  <span className="mt-3 inline-block w-fit rounded-full bg-emerald-50 px-3 py-1 font-body text-xs text-brand-green">
                    ⏱ {step.duration}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
