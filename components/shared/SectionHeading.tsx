import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  label,
  title,
  highlight,
  subtitle,
  centered = false,
  light = false,
  as = "h2",
  className,
}: SectionHeadingProps) {
  const hasHighlight = Boolean(highlight);
  const titleIncludesHighlight = hasHighlight && typeof highlight === "string" && title.includes(highlight);

  const titleParts =
    titleIncludesHighlight ? title.split(highlight as string) : [title];

  const HeadingTag = as;

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
      <HeadingTag
        className={cn(
          "font-display text-3xl font-bold text-text-primary md:text-4xl",
          light && "text-text-primary"
        )}
      >
        {hasHighlight && titleIncludesHighlight ? (
          <>
            {titleParts[0]}
            <span className="gradient-text">{highlight}</span>
            {titleParts[1]}
          </>
        ) : hasHighlight ? (
          <>
            {title} <span className="gradient-text">{highlight}</span>
          </>
        ) : (
          title
        )}
      </HeadingTag>
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
