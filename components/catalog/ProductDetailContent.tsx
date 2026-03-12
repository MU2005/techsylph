"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tag, ShieldCheck, Globe, PackageCheck } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/sanity";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  tshirts: "T-Shirts & Basics",
  hoodies: "Hoodies & Sweatshirts",
  activewear: "Activewear",
  custom: "Custom / Private Label",
};

type ProductDetailContentProps = {
  product: Product;
};

export default function ProductDetailContent({
  product,
}: ProductDetailContentProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = product.images ?? [];
  const mainImage = images[activeImageIndex];
  const mainImageUrl = mainImage
    ? urlFor(mainImage).width(800).url()
    : null;

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
                Product Image Coming Soon
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
                  alt=""
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
          {CATEGORY_LABELS[product.category]}
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
                Fabric
              </p>
              <p className="mt-0.5 font-body text-sm font-medium text-text-primary">
                {product.fabricDetails || "Available on request"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-text-muted">
                Min. Order
              </p>
              <p className="mt-0.5 font-body text-sm font-medium text-text-primary">
                {product.moq ? `${product.moq} pieces` : "Contact us"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-body text-xs uppercase tracking-wide text-text-muted">
                Customizable
              </p>
              <p className="mt-0.5 font-body text-sm font-medium text-text-primary">
                {product.customizable
                  ? "Yes — Private label available"
                  : "Standard only"}
              </p>
            </div>
          </div>
        </div>

        {/* Available sizes */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="mt-6">
            <p className="font-body text-xs uppercase tracking-wide text-text-muted">
              Available Sizes
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
              Available Colors
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
                  Private Label Available
                </p>
                <p className="mt-1 font-body text-sm text-text-secondary">
                  This product can be manufactured with your branding, custom
                  labels, and packaging.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton
            href="/rfq"
            variant="primary"
            size="lg"
            className="w-full sm:flex-1"
          >
            Request a Quote for This Product
          </CTAButton>
          <CTAButton
            href="/contact"
            variant="outline"
            size="lg"
            className="w-full sm:flex-1"
          >
            Contact Us
          </CTAButton>
        </div>

        {/* Trust row */}
        <div className="mt-6 flex flex-wrap gap-4">
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <ShieldCheck className="size-4 text-brand-green" />
            Quality Guaranteed
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <Globe className="size-4 text-brand-green" />
            Global Shipping
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-text-muted">
            <PackageCheck className="size-4 text-brand-green" />
            Fast Turnaround
          </span>
        </div>
      </motion.div>
    </div>
  );
}
