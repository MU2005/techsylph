import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SampleRequestForm } from "@/components/forms/SampleRequestForm";
import { client } from "@/sanity/lib/client";
import { PRODUCT_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types/sanity";

type PageProps = {
  searchParams: Promise<{
    product?: string;
    slug?: string;
    productUrl?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Request Sample",
  description:
    "Request a sample for this product. Share quantity, preferences, and custom options for review.",
};

export default async function SampleRequestPage({ searchParams }: PageProps) {
  const t = await getTranslations("sampleRequest");
  const params = await searchParams;
  const productNameFromQuery = (params.product ?? "").trim();
  const productSlug = (params.slug ?? "").trim();
  let product: Product | null = null;

  if (productSlug) {
    product = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
      slug: productSlug,
    });
  }

  const productName = product?.name || productNameFromQuery || t("unknownProduct");
  const productPath = productSlug ? `/catalog/${productSlug}` : "/catalog";
  const productUrl = params.productUrl?.trim() || productPath;
  const productImage = product?.images?.[0];
  const productImageUrl = productImage ? urlFor(productImage).width(600).url() : null;

  return (
    <div className="min-h-screen bg-surface-1">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-10">
        <SectionHeading
          as="h1"
          label={t("label")}
          title={t("title")}
          highlight={t("highlight")}
          subtitle={t("subtitle")}
        />
      </header>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <section className="card-base mb-6 p-4 sm:p-5">
          <p className="font-body text-xs uppercase tracking-wide text-text-muted">
            {t("productSummaryLabel")}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative size-16 overflow-hidden rounded-xl bg-surface-2 sm:size-20">
              {productImageUrl ? (
                <Image
                  src={productImageUrl}
                  alt={productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-display text-lg font-semibold text-text-primary">
                {productName}
              </p>
              <Link
                href={productPath}
                className="mt-1 inline-flex font-body text-sm text-brand-green hover:underline"
              >
                {t("viewProduct")}
              </Link>
            </div>
          </div>
        </section>

        <section className="card-base rounded-2xl p-6 sm:p-8">
          <SampleRequestForm
            productName={productName}
            productSlug={productSlug || undefined}
            productUrl={productUrl}
          />
        </section>
      </div>
    </div>
  );
}
