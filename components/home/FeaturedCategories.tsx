"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Shirt,
  Layers,
  Zap,
  Tag,
  Package,
  Globe,
  Star,
  ShieldCheck,
  Scissors,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTranslations } from "next-intl";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/types/sanity";

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt,
  Layers,
  Zap,
  Tag,
  Package,
  Globe,
  Star,
  ShieldCheck,
  Scissors,
  Palette,
};

const COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-500",
  blue: "text-blue-500",
  orange: "text-orange-500",
  purple: "text-purple-500",
  red: "text-red-500",
  pink: "text-pink-500",
  amber: "text-amber-500",
  sky: "text-sky-500",
};

const BG_MAP: Record<string, string> = {
  emerald: "bg-emerald-50",
  blue: "bg-blue-50",
  orange: "bg-orange-50",
  purple: "bg-purple-50",
  red: "bg-red-50",
  pink: "bg-pink-50",
  amber: "bg-amber-50",
  sky: "bg-sky-50",
};

const DEFAULT_CATEGORIES: NonNullable<SiteSettings["categories"]> = [
  {
    title: "T-Shirts & Basics",
    slug: "tshirts",
    description: "Premium basics for everyday wear.",
    icon: "Shirt",
    color: "emerald",
  },
  {
    title: "Hoodies & Sweatshirts",
    slug: "hoodies",
    description: "Premium fleece and French terry.",
    icon: "Layers",
    color: "blue",
  },
  {
    title: "Activewear",
    slug: "activewear",
    description: "Performance fabric, technical styles.",
    icon: "Zap",
    color: "orange",
  },
  {
    title: "Custom / Private Label",
    slug: "custom",
    description: "Your brand, our manufacturing.",
    icon: "Tag",
    color: "purple",
  },
];

interface FeaturedCategoriesProps {
  categories: SiteSettings["categories"];
}

export default function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  const tCategories = useTranslations("categories");
  const list =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : DEFAULT_CATEGORIES;

  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={tCategories("title")}
          highlight={tCategories("highlight")}
          subtitle={tCategories("subtitle")}
          centered
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {list.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon ?? "Shirt"] ?? Shirt;
            const colorClass = COLOR_MAP[cat.color ?? "emerald"] ?? "text-emerald-500";
            const bgClass = BG_MAP[cat.color ?? "emerald"] ?? "bg-emerald-50";
            const imageUrl =
              cat.image &&
              (() => {
                try {
                  return urlFor(cat.image).width(600).height(340).url();
                } catch {
                  return null;
                }
              })();

            return (
              <motion.div
                key={cat.slug ?? i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={{
                    pathname: "/catalog",
                    query: {
                      ...(cat.slug ? { category: cat.slug } : {}),
                      ...(cat.title ? { categoryTitle: cat.title } : {}),
                    },
                  }}
                  className="group flex h-full flex-col gap-3 rounded-2xl p-2 sm:gap-4 sm:p-4"
                >
                  {imageUrl ? (
                    <div className="relative mx-auto mb-2 aspect-square w-24 overflow-hidden rounded-full border border-surface-3 sm:mb-3 sm:w-32">
                      <Image
                        src={imageUrl}
                        alt={cat.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 12vw"
                      />
                    </div>
                  ) : (
                    <div className={`mx-auto flex size-24 items-center justify-center rounded-full ${bgClass} sm:size-32`}>
                      <Icon className={`size-6 sm:size-8 ${colorClass}`} />
                    </div>
                  )}
                  <h3 className="text-center font-display text-sm font-semibold text-text-primary sm:text-lg">
                    {cat.title}
                  </h3>
                  <p className="text-center font-body text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {cat.description ?? ""}
                  </p>
                  <span className="mt-auto text-center font-body text-xs font-semibold text-brand-green hover:underline sm:text-sm">
                    {tCategories("explore")}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
