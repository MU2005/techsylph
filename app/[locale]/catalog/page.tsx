import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY, PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CatalogClient } from "@/components/catalog";
import { Link } from "@/i18n/navigation";
import type { Category, Product } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Product Catalog — Apparel Export",
  description:
    "Browse TechSylph's full apparel catalog. T-shirts, hoodies, activewear, and custom private label. No MOQ shown — request a quote.",
};
export const revalidate = 300;

export default async function CatalogPage() {
  const tCatalogPage = await getTranslations("catalogPage");
  let products: Product[] = [];
  let categories: Category[] = [];
  try {
    const [productsData, categoriesData] = await Promise.all([
      client.fetch<Product[]>(PRODUCTS_QUERY),
      client.fetch<Category[]>(CATEGORIES_QUERY),
    ]);
    products = Array.isArray(productsData) ? productsData : [];
    categories = Array.isArray(categoriesData) ? categoriesData : [];
  } catch {
    products = [];
    categories = [];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <Link
          href="/"
          className="font-body text-sm text-text-muted hover:text-text-primary"
        >
          {tCatalogPage("breadcrumb")}
        </Link>
        <SectionHeading
          as="h1"
          label={tCatalogPage("label")}
          title={tCatalogPage("title")}
          highlight={tCatalogPage("highlight")}
          subtitle={tCatalogPage("subtitle")}
          centered={false}
        />
      </section>

      {/* Catalog grid + filters */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <CatalogClient products={products} categories={categories} />
      </div>
    </div>
  );
}
