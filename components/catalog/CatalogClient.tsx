"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import ProductFilters, { type FilterState } from "./ProductFilters";
import { CTAButton } from "@/components/shared/CTAButton";
import type { Category, Product } from "@/types/sanity";

type CatalogClientProps = {
  products: Product[];
  categories: Category[];
};

const PRODUCTS_PER_PAGE = 12;

function normalizeCategoryKey(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

export default function CatalogClient({ products, categories }: CatalogClientProps) {
  const t = useTranslations("catalog");
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";
  const categoryTitleFromUrl = searchParams.get("categoryTitle") ?? "";
  const resolvedCategoryFromUrl = useMemo(() => {
    const normalizedSlug = normalizeCategoryKey(categoryFromUrl);
    const normalizedTitle = normalizeCategoryKey(categoryTitleFromUrl);
    if (!normalizedSlug && !normalizedTitle) {
      return "";
    }

    const matchedCategory = categories.find((category) => {
      const categorySlug = normalizeCategoryKey(category.slug);
      const categoryTitle = normalizeCategoryKey(category.title);
      return (
        (!!normalizedSlug && (categorySlug === normalizedSlug || categoryTitle === normalizedSlug)) ||
        (!!normalizedTitle && (categoryTitle === normalizedTitle || categorySlug === normalizedTitle))
      );
    });

    return matchedCategory?.slug ?? "";
  }, [categories, categoryFromUrl, categoryTitleFromUrl]);

  const [filters, setFilters] = useState<FilterState>(() => ({
    search: "",
    category: "",
    customizable: false,
  }));
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilters((prev) =>
      prev.category === resolvedCategoryFromUrl
        ? prev
        : { ...prev, category: resolvedCategoryFromUrl }
    );
  }, [resolvedCategoryFromUrl]);

  const filtered = useMemo(() => {
    const normalizedSearch = filters.search.toLowerCase();
    return products.filter((p) => {
      const productName = typeof p.name === "string" ? p.name.toLowerCase() : "";
      const productDescription =
        typeof p.description === "string" ? p.description.toLowerCase() : "";
      const matchSearch =
        !filters.search ||
        productName.includes(normalizedSearch) ||
        productDescription.includes(normalizedSearch);
      const matchCategory =
        !filters.category || p.category?.slug === filters.category;
      const matchCustom = !filters.customizable || p.customizable === true;
      return matchSearch && matchCategory && matchCustom;
    });
  }, [products, filters]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.customizable, filters.category]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <>
      <ProductFilters
        filters={filters}
        onFilterChange={setFilters}
        totalCount={filtered.length}
        categoryOptions={categories.map((c) => ({ slug: c.slug, title: c.title }))}
      />
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-surface-1 p-6 text-center sm:p-12">
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
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {paginatedProducts.map((product, i) => (
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

          {totalPages > 1 ? (
            <nav className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label={t("paginationLabel")}>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-surface-3 bg-white px-3 py-1.5 font-body text-xs text-text-secondary transition-colors hover:border-brand-green/40 hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                {t("previous")}
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={
                    currentPage === pageNumber
                      ? "rounded-full gradient-bg px-3 py-1.5 font-body text-xs font-medium text-white shadow-sm sm:px-4 sm:py-2 sm:text-sm"
                      : "hidden rounded-full border border-surface-3 bg-white px-3 py-1.5 font-body text-xs text-text-secondary transition-colors hover:border-brand-green/40 hover:text-brand-green sm:inline-flex sm:px-4 sm:py-2 sm:text-sm"
                  }
                >
                  {pageNumber}
                </button>
              ))}

              <span className="px-1 font-body text-xs text-text-muted sm:hidden">
                {currentPage}/{totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-surface-3 bg-white px-3 py-1.5 font-body text-xs text-text-secondary transition-colors hover:border-brand-green/40 hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                {t("next")}
              </button>
            </nav>
          ) : null}
        </div>
      )}
    </>
  );
}
