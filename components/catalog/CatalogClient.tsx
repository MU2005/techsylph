"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import ProductFilters, { type FilterState } from "./ProductFilters";
import { CTAButton } from "@/components/shared/CTAButton";
import type { Product } from "@/types/sanity";

type CatalogClientProps = {
  products: Product[];
};

export default function CatalogClient({ products }: CatalogClientProps) {
  const t = useTranslations("catalog");
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: "",
    category: categoryFromUrl,
    customizable: false,
  }));

  const effectiveCategory = categoryFromUrl || filters.category;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.description?.toLowerCase().includes(filters.search.toLowerCase()) ??
          false);
      const matchCategory =
        !effectiveCategory || p.category === effectiveCategory;
      const matchCustom = !filters.customizable || p.customizable === true;
      return matchSearch && matchCategory && matchCustom;
    });
  }, [products, filters, effectiveCategory]);

  return (
    <>
      <ProductFilters
        filters={{ ...filters, category: effectiveCategory }}
        onFilterChange={setFilters}
        totalCount={filtered.length}
      />
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-surface-1 p-12 text-center">
          <PackageSearch className="mx-auto size-16 text-text-muted" />
          <p className="mt-4 font-display text-2xl font-bold text-text-secondary">
            {t("noResults")}
          </p>
          <p className="mt-2 font-body text-sm text-text-secondary">
            {t("tryAdjustingFilters")}
          </p>
          <CTAButton
            variant="outline"
            size="md"
            onClick={() =>
              setFilters({
                search: "",
                category: "",
                customizable: false,
              })
            }
            className="mt-6"
          >
            {t("clearFilters")}
          </CTAButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
