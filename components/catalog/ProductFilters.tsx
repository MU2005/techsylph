"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type FilterState = {
  search: string;
  category: string;
  customizable: boolean;
};

const CATEGORY_OPTIONS = [
  { value: "", key: "all" as const },
  { value: "tshirts", key: "categoryTshirts" as const },
  { value: "hoodies", key: "categoryHoodies" as const },
  { value: "activewear", key: "categoryActivewear" as const },
  { value: "custom", key: "categoryCustom" as const },
] as const;

type ProductFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
};

const DEBOUNCE_MS = 300;

function SearchInputWithDebounce({
  initialSearch,
  filters,
  onFilterChange,
  placeholder,
  "aria-label": ariaLabel,
}: {
  initialSearch: string;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  placeholder: string;
  "aria-label": string;
}) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    const id = setTimeout(() => {
      onFilterChange({ ...filtersRef.current, search: searchInput });
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchInput, onFilterChange]);
  return (
    <input
      type="search"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-surface-3 bg-white py-2.5 pl-10 pr-4 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none focus:ring-2 focus:ring-brand-green/10 transition-all"
      aria-label={ariaLabel}
    />
  );
}

export default function ProductFilters({
  filters,
  onFilterChange,
  totalCount,
}: ProductFiltersProps) {
  const t = useTranslations("catalog");

  const handleCategory = useCallback(
    (value: string) => {
      onFilterChange({ ...filters, category: value });
    },
    [filters, onFilterChange]
  );

  const handleCustomizable = useCallback(
    (checked: boolean) => {
      onFilterChange({ ...filters, customizable: checked });
    },
    [filters, onFilterChange]
  );

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <SearchInputWithDebounce
          key={filters.search}
          initialSearch={filters.search}
          filters={filters}
          onFilterChange={onFilterChange}
          placeholder={t("search")}
          aria-label="Search products"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map(({ value, key }) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => handleCategory(value)}
            className={cn(
              "rounded-full px-4 py-2 font-body text-xs font-medium transition-all duration-200 cursor-pointer",
              filters.category === value
                ? "gradient-bg text-white shadow-sm"
                : "border border-surface-3 bg-white text-text-secondary hover:border-brand-green/40 hover:text-brand-green"
            )}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {/* Count + Custom toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-body text-sm text-text-muted">
          {totalCount === 1 ? t("productsCount", { count: totalCount }) : t("productsCountPlural", { count: totalCount })}
        </span>
        <label className="flex cursor-pointer items-center gap-2">
          <span className="font-body text-xs text-text-secondary">
            {t("customLabelOnly")}
          </span>
          <span
            role="switch"
            aria-checked={filters.customizable}
            tabIndex={0}
            onClick={() => handleCustomizable(!filters.customizable)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCustomizable(!filters.customizable);
              }
            }}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
              filters.customizable ? "gradient-bg" : "border border-surface-3 bg-white"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block size-5 translate-y-0.5 rounded-full bg-white shadow transition-transform",
                filters.customizable ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </span>
        </label>
      </div>
    </div>
  );
}
