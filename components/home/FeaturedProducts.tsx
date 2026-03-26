"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shirt, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CTAButton } from "@/components/shared/CTAButton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnimatedLine } from "@/components/shared/ScrollAnimations";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/sanity";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("featuredProducts");
  const tCatalog = useTranslations("catalog");
  const router = useRouter();

  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={t("fpTitle")}
          highlight={t("fpHighlight")}
          subtitle={t("fpSubtitle")}
          centered
        />
        <div className="mx-auto mt-6 max-w-2xl">
          <AnimatedLine
            direction="horizontal"
            className="h-px w-full bg-gray-400"
            origin="center"
          />
        </div>
        {products.length === 0 ? (
          <div className="py-16 text-center font-body text-text-muted">
            {t("emptyMessage")}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-3">
            {products.map((product, i) => {
              const imageUrl = product.images?.[0]
                ? urlFor(product.images[0]).width(400).url()
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
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`card-base flex h-full flex-col overflow-hidden ${
                    productHref ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2" : ""
                  }`}
                  onClick={handleCardClick}
                  onKeyDown={handleCardKeyDown}
                  role={productHref ? "link" : undefined}
                  tabIndex={productHref ? 0 : undefined}
                  aria-label={productHref ? `${product.name} ${t("viewDetails")}` : undefined}
                >
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
                        <Shirt className="size-10 text-brand-green/30 sm:size-20" />
                        <span className="px-2 text-center font-body text-[10px] text-text-muted sm:text-xs">
                          {t("photoComingSoon")}
                        </span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute left-2 top-2 badge-green text-[10px] sm:left-3 sm:top-3 sm:text-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>
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
                    <div className="mt-0.5 flex items-center gap-1 font-body text-[10px] text-text-muted sm:mt-1 sm:text-xs">
                      <PackageCheck className="size-3.5 text-brand-green sm:size-4" />
                      {product.moq != null
                        ? `${tCatalog("moq")} ${product.moq} ${tCatalog("pcs")}`
                        : t("contactUs")}
                    </div>
                    <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:flex-row sm:gap-2 sm:pt-3">
                      <CTAButton
                        href="/rfq"
                        variant="primary"
                        size="sm"
                        className="w-full rounded-lg px-2 py-1.5 text-[11px] sm:flex-1 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {t("inquireNow")}
                      </CTAButton>
                      <CTAButton
                        href={productHref ?? "/catalog"}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg border-surface-3 px-2 py-1.5 text-[11px] sm:flex-1 sm:px-4 sm:py-2 sm:text-sm"
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
