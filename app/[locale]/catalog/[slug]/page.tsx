import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { PRODUCT_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";
import ProductDetailContent from "@/components/catalog/ProductDetailContent";
import ProductCard from "@/components/catalog/ProductCard";
import JsonLd from "@/components/shared/JsonLd";
import type { Product } from "@/types/sanity";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug,
  });
  if (!product) return { title: "Product Not Found" };
  const title = product.name;
  const description =
    typeof product.description === "string"
      ? product.description
      : "TechSylph apparel product. Request a quote for wholesale pricing.";
  const imageUrl =
    product.images?.[0] != null
      ? urlFor(product.images[0]).width(1200).url()
      : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/catalog/${slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

const RELATED_QUERY = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $slug][0...3] {
  _id, name, slug, "category": category->{title, "slug": slug.current}, description, moq, badge, images, customizable
}`;

export async function generateStaticParams() {
  const locales = ["en", "fr", "de"];
  const products = await client.fetch<Array<{ slug?: string | { current?: string | null } | null }>>(
    `*[_type == "product"]{ "slug": slug.current }`
  );
  const slugs = (products ?? [])
    .map((p) => {
      if (typeof p.slug === "string") return p.slug;
      if (p.slug && typeof p.slug === "object" && typeof p.slug.current === "string") {
        return p.slug.current;
      }
      return null;
    })
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export default async function CatalogSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const tNav = await getTranslations("nav");
  const tCatalog = await getTranslations("catalog");

  const product = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug,
  });

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      typeof product.description === "string"
        ? product.description
        : "TechSylph apparel product.",
    brand: {
      "@type": "Brand",
      name: "TechSylph",
    },
    manufacturer: {
      "@type": "Organization",
      name: "TechSylph",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
      },
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      seller: {
        "@type": "Organization",
        name: "TechSylph",
      },
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://techsylph.shop/${locale}` },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `https://techsylph.shop/${locale}/catalog` },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://techsylph.shop/${locale}/catalog/${slug}` },
    ],
  };

  const related = await client.fetch<Product[]>(RELATED_QUERY, {
    categorySlug: product.category?.slug ?? "",
    slug,
  });
  const relatedList = Array.isArray(related) ? related : [];

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-0">
        <nav className="font-body text-sm text-text-muted" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-text-secondary transition-colors hover:text-brand-green"
          >
            {tNav("home")}
          </Link>
          <span className="mx-1">/</span>
          <Link
            href="/catalog"
            className="text-text-secondary transition-colors hover:text-brand-green"
          >
            {tNav("catalog")}
          </Link>
          <span className="mx-1">/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <ProductDetailContent product={product} />
      </div>

      {/* Related products */}
      {relatedList.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-20">
          <SectionHeading
            label={tCatalog("relatedLabel")}
            title={tCatalog("relatedTitle")}
            highlight={tCatalog("relatedHighlight")}
            centered={false}
          />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedList.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
