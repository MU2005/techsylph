"use client";

import { motion } from "framer-motion";

export type AnimatedLineOrigin = "left" | "right" | "top" | "bottom" | "center";

export interface AnimatedLineProps {
  direction?: "horizontal" | "vertical";
  className?: string;
  /** Origin of the "draw" animation: line grows from this edge (or "center" = grows from middle). */
  origin?: AnimatedLineOrigin;
  style?: React.CSSProperties;
}

const DEFAULT_VIEWPORT = { once: true, amount: 0.2 } as const;
const DEFAULT_TRANSITION = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * AnimatedLine: a line that "draws" in on scroll (scale 0 → 1 from the given origin).
 * Use origin="center" for the line to appear from the middle and grow outward.
 */
export function AnimatedLine({
  direction = "horizontal",
  className = "",
  origin = "center",
  style = {},
}: AnimatedLineProps) {
  const isHorizontal = direction === "horizontal";
  const transformOriginValue = origin === "center" ? "center" : origin;

  return (
    <motion.div
      className={className}
      style={{ ...style, transformOrigin: transformOriginValue }}
      initial={{
        scaleX: isHorizontal ? 0 : 1,
        scaleY: isHorizontal ? 1 : 0,
      }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={DEFAULT_VIEWPORT}
      transition={DEFAULT_TRANSITION}
    />
  );
}
