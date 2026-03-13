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
  const list =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : DEFAULT_CATEGORIES;

  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Premium Apparel"
          highlight="Categories"
          subtitle="From basics to activewear — explore our full range of export-ready garments manufactured in Pakistan."
          centered
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  href={`/catalog?category=${cat.slug}`}
                  className="card-base group flex flex-col gap-4 p-6"
                >
                  {imageUrl ? (
                    <div className="-mx-6 -mt-6 mb-4 w-[calc(100%+3rem)] aspect-video overflow-hidden rounded-t-xl relative">
                      <Image
                        src={imageUrl}
                        alt={cat.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className={`icon-box ${bgClass}`}>
                      <Icon className={`size-6 ${colorClass}`} />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {cat.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-text-secondary">
                    {cat.description ?? ""}
                  </p>
                  <span className="mt-auto font-body text-sm font-semibold text-brand-green hover:underline">
                    Explore →
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
