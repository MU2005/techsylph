import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CatalogClient } from "@/components/catalog";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Product Catalog — Apparel Export",
  description:
    "Browse TechSylph's full apparel catalog. T-shirts, hoodies, activewear, and custom private label. No MOQ shown — request a quote.",
};

export default async function CatalogPage() {
  let products: Product[] = [];
  try {
    const data = await client.fetch<Product[]>(PRODUCTS_QUERY);
    products = Array.isArray(data) ? data : [];
  } catch {
    products = [];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <Link
          href="/"
          className="font-body text-sm text-text-muted hover:text-text-primary"
        >
          Home / Catalog
        </Link>
        <SectionHeading
          label="Our Collection"
          title="Product"
          highlight="Catalog"
          subtitle="Explore our full range of export-ready apparel. No prices shown — submit an inquiry for a custom wholesale quote."
          centered={false}
        />
      </section>

      {/* Catalog grid + filters */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <CatalogClient products={products} />
      </div>
    </div>
  );
}
