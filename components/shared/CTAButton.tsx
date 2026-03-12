"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CTAButtonVariant = "primary" | "outline" | "ghost";
type CTAButtonSize = "sm" | "md" | "lg";

type CTAButtonProps = {
  variant?: CTAButtonVariant;
  size?: CTAButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

const variantClasses: Record<CTAButtonVariant, string> = {
  primary:
    "gradient-bg text-white font-body font-semibold rounded-xl shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200 border-0",
  outline:
    "bg-white border border-surface-3 text-text-primary font-body font-semibold rounded-xl hover:bg-surface-1 hover:border-brand-green/40 transition-all duration-200",
  ghost:
    "bg-transparent border-0 text-text-secondary font-body rounded-xl hover:bg-surface-1 hover:text-text-primary transition-all duration-200",
};

const sizeClasses: Record<CTAButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

export function CTAButton({
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  disabled = false,
  children,
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
