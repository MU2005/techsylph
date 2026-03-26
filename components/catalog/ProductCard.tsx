"use client";

import Image from "next/image";
import { Shirt, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CTAButton } from "@/components/shared/CTAButton";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/sanity";

export default function ProductCard({ product }: { product: Product }) {
  const tCatalog = useTranslations("catalog");
  const router = useRouter();
  const image = product.images?.[0];
  const imageUrl = image
    ? urlFor(image).width(400).url()
    : null;
  const productSlug =
    typeof product.slug?.current === "string" && product.slug.current.length > 0
      ? product.slug.current
      : null;
  const productHref = productSlug ? `/catalog/${productSlug}` : null;

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!productHref) return;
    const target = event.target as HTMLElement;
    const interactiveElement = target.closest("a, button, input, textarea, select, [role='button'], [role='link']");
    if (interactiveElement && interactiveElement !== event.currentTarget) {
      return;
    }
    router.push(productHref);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!productHref) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(productHref);
    }
  };

  return (
    <div
      className={`card-base flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        productHref ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2" : ""
      }`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role={productHref ? "link" : undefined}
      tabIndex={productHref ? 0 : undefined}
      aria-label={productHref ? `${product.name} ${tCatalog("viewDetails")}` : undefined}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-surface-2 sm:aspect-[4/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <Shirt className="size-10 text-brand-green/30 sm:size-16" />
            <span className="px-2 text-center font-body text-[10px] text-text-muted sm:mt-2 sm:text-xs">
              {tCatalog("photoComingSoon")}
            </span>
          </div>
        )}
        {product.badge && (
          <span className="absolute left-2 top-2 badge-green text-[10px] sm:left-3 sm:top-3 sm:text-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
        <span className="line-clamp-1 font-body text-[10px] font-semibold uppercase tracking-wide text-brand-green sm:text-xs">
          {product.category?.title ?? tCatalog("uncategorized")}
        </span>
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-text-primary sm:text-lg">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 font-body text-xs text-text-secondary sm:text-sm">
            {product.description}
          </p>
        )}
        {product.moq != null && (
          <div className="mt-0.5 flex items-center gap-1 font-body text-[10px] text-text-muted sm:mt-1 sm:text-xs">
            <PackageCheck className="size-3.5 text-brand-green sm:size-4" />
            <span>
              {tCatalog("moq")} {product.moq} {tCatalog("pcs")}
            </span>
          </div>
        )}
        <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:flex-row sm:gap-2 sm:pt-3">
          <CTAButton
            href="/rfq"
            variant="primary"
            size="sm"
            className="w-full rounded-lg px-2 py-1.5 text-[11px] sm:flex-1 sm:px-4 sm:py-2 sm:text-sm"
          >
            {tCatalog("inquire")}
          </CTAButton>
          {productSlug ? (
            <CTAButton
              href={`/catalog/${productSlug}`}
              variant="outline"
              size="sm"
              className="w-full rounded-lg border-surface-3 px-2 py-1.5 text-[11px] sm:flex-1 sm:px-4 sm:py-2 sm:text-sm"
            >
              {tCatalog("viewDetails")}
            </CTAButton>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-surface-3 px-2 py-1.5 text-[11px] font-body font-semibold text-text-muted opacity-60 sm:flex-1 sm:px-4 sm:py-2 sm:text-sm"
            >
              {tCatalog("viewDetails")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
