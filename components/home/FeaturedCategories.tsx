"use client";

import { motion } from "framer-motion";
import { Shirt, Wind, Zap, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";

const CATEGORIES = [
  {
    icon: Shirt,
    title: "T-Shirts & Basics",
    desc: "High-quality everyday essentials. Cotton, blends, all fits.",
  },
  {
    icon: Wind,
    title: "Hoodies & Sweatshirts",
    desc: "Premium fleece and French terry. Custom prints & embroidery.",
  },
  {
    icon: Zap,
    title: "Activewear",
    desc: "Performance fabrics, moisture-wicking. Sport and gym ready.",
  },
  {
    icon: Tag,
    title: "Custom / Private Label",
    desc: "Your brand, our manufacturing. Full OEM & ODM service.",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Our Products"
          title="Premium Apparel"
          highlight="Categories"
          subtitle="From basics to activewear — explore our full range of export-ready garments manufactured in Pakistan."
          centered
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href="/catalog"
                className="card-base group flex flex-col gap-4 p-6"
              >
                <div className="icon-box">
                  <cat.icon className="size-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {cat.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-text-secondary">
                  {cat.desc}
                </p>
                <span className="mt-auto font-body text-sm font-semibold text-brand-green hover:underline">
                  Explore →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
