import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techsylph.shop";
  const locales = ["en", "fr", "de"];

  const staticPages = [
    "",
    "/catalog",
    "/about",
    "/why-us",
    "/how-it-works",
    "/custom-label",
    "/contact",
    "/rfq",
    "/blog",
    "/faq",
    "/lookbook",
  ];

  const staticEntries = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  const products = await client.fetch<{ slug: string }[]>(
    `*[_type == "product"]{ "slug": slug.current }`
  );
  const productEntries = (products ?? []).flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/catalog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const posts = await client.fetch<{ slug: string }[]>(
    `*[_type == "blogPost"]{ "slug": slug.current }`
  );
  const blogEntries = (posts ?? []).flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...productEntries, ...blogEntries];
}
