"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shirt, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/sanity";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  tshirts: "T-Shirts & Basics",
  hoodies: "Hoodies & Sweatshirts",
  activewear: "Activewear",
  custom: "Custom / Private Label",
};

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("featuredProducts");
  const tCatalog = useTranslations("catalog");

  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label={t("fpLabel")}
          title={t("fpTitle")}
          highlight={t("fpHighlight")}
          subtitle={t("fpSubtitle")}
          centered
        />
        {products.length === 0 ? (
          <div className="py-16 text-center font-body text-text-muted">
            {t("emptyMessage")}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => {
              const imageUrl = product.images?.[0]
                ? urlFor(product.images[0]).width(400).url()
                : null;
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="card-base flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-surface-2">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <Shirt className="size-20 text-brand-green/30" />
                        <span className="font-body text-xs text-text-muted">
                          {t("photoComingSoon")}
                        </span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute left-3 top-3 badge-green">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand-green">
                      {CATEGORY_LABELS[product.category]}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="line-clamp-2 font-body text-sm text-text-secondary">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-1 font-body text-xs text-text-muted">
                      <PackageCheck className="size-4 text-brand-green" />
                      {product.moq != null
                        ? `${tCatalog("moq")} ${product.moq} ${tCatalog("pcs")}`
                        : t("contactUs")}
                    </div>
                    <div className="mt-auto flex gap-2 pt-3">
                      <CTAButton
                        href="/rfq"
                        variant="primary"
                        size="sm"
                        className="flex-1 rounded-lg px-4 py-2 text-sm"
                      >
                        {t("inquireNow")}
                      </CTAButton>
                      <CTAButton
                        href={`/catalog/${product.slug.current}`}
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-surface-3 px-4 py-2 text-sm"
                      >
                        {t("viewDetails")}
                      </CTAButton>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <CTAButton href="/catalog" variant="primary" size="lg">
            {t("viewFullCatalog")}
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
