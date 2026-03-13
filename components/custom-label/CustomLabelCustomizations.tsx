"use client";

import Image from "next/image";
import {
  Tag,
  Scissors,
  Palette,
  Layers,
  Package,
  Ruler,
  Star,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { CustomLabelData } from "@/types/sanity";

const ICON_MAP: Record<string, LucideIcon> = {
  Tag,
  Scissors,
  Palette,
  Layers,
  Package,
  Ruler,
  Star,
  ShieldCheck,
};

type Customization = NonNullable<CustomLabelData["customizations"]>[number];

export function CustomLabelCustomizations({
  customizations,
}: {
  customizations: Customization[];
}) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {customizations.map((item, i) => {
        const Icon = ICON_MAP[item.icon ?? "Tag"] ?? Tag;
        let imageUrl: string | null = null;
        if (item.image) {
          try {
            imageUrl = urlFor(item.image).width(600).height(340).url();
          } catch {
            imageUrl = null;
          }
        }
        return (
          <div key={item.title ?? i} className="glow-card-subtle h-full">
            <div className="glow-card-inner flex h-full flex-col p-6">
              {imageUrl ? (
                <div className="relative mb-4 w-full overflow-hidden rounded-xl aspect-video">
                  <Image
                    src={imageUrl}
                    alt={item.title ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="mb-4 w-fit rounded-xl bg-emerald-50 p-3">
                  <Icon className="size-6 text-brand-green" />
                </div>
              )}
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm text-text-secondary">
                {item.description ?? ""}
              </p>
              {Array.isArray(item.details) && item.details.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {item.details.map((d, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 font-body text-sm text-text-secondary"
                    >
                      <span className="text-brand-green">✓</span> {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
