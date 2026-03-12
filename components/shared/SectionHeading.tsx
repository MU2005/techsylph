import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  label,
  title,
  highlight,
  subtitle,
  centered = false,
  light = false,
  className,
}: SectionHeadingProps) {
  const titleParts =
    highlight && title.includes(highlight)
      ? title.split(highlight)
      : [title];

  return (
    <div
      className={cn(
        "space-y-3",
        centered && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <div className={centered ? "flex flex-col items-center" : ""}>
          <span className="badge-green">
            {label}
          </span>
        </div>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold text-text-primary md:text-4xl",
          light && "text-text-primary"
        )}
      >
        {highlight && title.includes(highlight) ? (
          <>
            {titleParts[0]}
            <span className="gradient-text">{highlight}</span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl font-body text-base leading-relaxed text-text-secondary",
            centered && "mx-auto text-center",
            light && "text-text-secondary"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
