"use client";

import Image from "next/image";
import { Shirt, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/sanity";

export default function ProductCard({ product }: { product: Product }) {
  const tCatalog = useTranslations("catalog");
  const image = product.images?.[0];
  const imageUrl = image
    ? urlFor(image).width(400).url()
    : null;
  const productSlug =
    typeof product.slug?.current === "string" && product.slug.current.length > 0
      ? product.slug.current
      : null;

  return (
    <div className="card-base flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-surface-2">
            <Shirt className="size-16 text-brand-green/30" />
            <span className="mt-2 font-body text-xs text-text-muted">
              {tCatalog("photoComingSoon")}
            </span>
          </div>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 badge-green">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand-green">
          {product.category?.title ?? tCatalog("uncategorized")}
        </span>
        <h3 className="font-display text-lg font-semibold leading-snug text-text-primary">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 font-body text-sm text-text-secondary">
            {product.description}
          </p>
        )}
        {product.moq != null && (
          <div className="mt-1 flex items-center gap-1">
            <PackageCheck className="size-4 text-brand-green" />
            <span className="font-body text-xs text-text-muted">
              {tCatalog("moq")} {product.moq} {tCatalog("pcs")}
            </span>
          </div>
        )}
        <div className="mt-auto flex gap-2 pt-3">
          <CTAButton
            href="/rfq"
            variant="primary"
            size="sm"
            className="flex-1 rounded-lg text-sm"
          >
            {tCatalog("inquire")}
          </CTAButton>
          {productSlug ? (
            <CTAButton
              href={`/catalog/${productSlug}`}
              variant="outline"
              size="sm"
              className="rounded-lg border-surface-3 text-sm"
            >
              {tCatalog("viewDetails")}
            </CTAButton>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-surface-3 px-4 py-2 text-sm font-body font-semibold text-text-muted opacity-60"
            >
              {tCatalog("viewDetails")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
