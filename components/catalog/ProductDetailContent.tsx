"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tag, ShieldCheck, Globe, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/sanity";

type ProductDetailContentProps = {
  product: Product;
};

export default function ProductDetailContent({
  product,
}: ProductDetailContentProps) {
  const t = useTranslations("productDetail");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = product.images ?? [];
  const mainImage = images[activeImageIndex];
  const mainImageUrl = mainImage
    ? urlFor(mainImage).width(800).url()
    : null;
  const productNameParam = encodeURIComponent(product.name);
  const productSlug = product.slug?.current ?? "";
  const productSlugParam = encodeURIComponent(productSlug);
  const productPath = productSlug ? `/catalog/${productSlug}` : "/catalog";
  const productPathParam = encodeURIComponent(productPath);
  const sampleInquiryHref = `/sample-request?product=${productNameParam}&slug=${productSlugParam}&productUrl=${productPathParam}`;
  const quoteHref = `/rfq?product=${productNameParam}`;
  const contactSalesHref = `/contact?type=sales&product=${productNameParam}`;

  return (
    <div className="grid grid-cols-1 gap-16 bg-white lg:grid-cols-2 lg:items-start">
      {/* Left — Image gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-1">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-surface-1">
              <span className="font-display text-8xl font-bold text-text-muted/20">
                TS
              </span>
              <span className="mt-2 font-body text-sm text-text-muted">
                {t("imageComingSoon")}
              </span>
            </div>
          )}
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-sm font-semibold text-white gradient-bg">
              {product.badge}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImageIndex === i
                    ? "border-brand-green"
                    : "border-transparent hover:border-brand-green/50"
                }`}
              >
                <Image
                  src={urlFor(img).width(160).url()}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  width={80}
                  height={80}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right — Product info */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-green">
          {product.category?.title ?? t("uncategorized")}
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
          {product.name}
        </h1>
        <div className="mt-4 h-1 w-16 rounded-full gradient-bg" />
        {product.description && (
          <p className="mt-4 max-w-lg font-body text-base leading-relaxed text-text-secondary">
            {product.description}
          </p>
        )}

        {/* Details grid */}
        <div className="mt-6 rounded-xl bg-surface-1 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-text-muted">
                {t("fabric")}
              </p>
              <p className="mt-0.5 font-body text-sm font-medium text-text-primary">
                {product.fabricDetails || t("availableOnRequest")}
              </p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-text-muted">
                {t("minOrder")}
              </p>
              <p className="mt-0.5 font-body text-sm font-medium text-text-primary">
                {product.moq ? `${product.moq} ${t("pieces")}` : t("contactUs")}
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-body text-xs uppercase tracking-wide text-text-muted">
                {t("customizable")}
              </p>
              <p className="mt-0.5 font-body text-sm font-medium text-text-primary">
                {product.customizable
                  ? t("customizableYes")
                  : t("customizableNo")}
              </p>
            </div>
          </div>
        </div>

        {/* Available sizes */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="mt-6">
            <p className="font-body text-xs uppercase tracking-wide text-text-muted">
              {t("availableSizes")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <span
                  key={size}
                  className="rounded-lg border border-surface-3 bg-white px-3 py-1.5 font-body text-sm text-text-secondary hover:border-brand-green"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Available colors */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="mt-4">
            <p className="font-body text-xs uppercase tracking-wide text-text-muted">
              {t("availableColors")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.availableColors.map((color) => (
                <span
                  key={color}
                  className="rounded-lg border border-brand-green-light bg-white px-3 py-1.5 font-body text-sm text-brand-green"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Private label banner */}
        {product.customizable && (
          <div className="mt-6 rounded-xl border border-brand-green-light bg-emerald-50/80 p-4">
            <div className="flex items-start gap-3">
              <Tag className="mt-0.5 size-5 shrink-0 text-brand-green" />
              <div>
                <p className="font-display text-sm font-semibold text-text-primary">
                  {t("privateLabelAvailable")}
                </p>
                <p className="mt-1 font-body text-sm text-text-secondary">
                  {t("privateLabelDescription")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="mt-8">
          <p className="mb-3 font-body text-xs text-text-muted">
            {t("sampleSupportNote")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CTAButton
              href={quoteHref}
              variant="primary"
              size="lg"
              className="w-full sm:flex-1"
            >
              {t("requestQuote")}
            </CTAButton>
            <CTAButton
              href={sampleInquiryHref}
              variant="outline"
              size="lg"
              className="w-full sm:flex-1"
            >
              {t("requestSample")}
            </CTAButton>
          </div>
          <div className="mt-3">
            <Link
              href={contactSalesHref}
              className="font-body text-sm font-medium text-text-secondary underline-offset-2 transition-colors hover:text-brand-green hover:underline"
            >
              {t("contactSales")}
            </Link>
          </div>
        </div>

        {/* Trust row */}
        <div className="mt-6 flex flex-wrap gap-4">
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <ShieldCheck className="size-4 text-brand-green" />
            {t("qualityGuaranteed")}
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <Globe className="size-4 text-brand-green" />
            {t("globalShipping")}
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <PackageCheck className="size-4 text-brand-green" />
            {t("fastTurnaround")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
