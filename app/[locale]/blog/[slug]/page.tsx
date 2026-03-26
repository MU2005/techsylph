import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { BLOG_POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/i18n/navigation";
import PortableTextContent from "@/components/shared/PortableTextContent";
import JsonLd from "@/components/shared/JsonLd";
import { CTAButton } from "@/components/shared/CTAButton";
import type { BlogPost } from "@/types/sanity";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await client.fetch<BlogPost | null>(BLOG_POST_BY_SLUG_QUERY, {
    slug,
  });
  if (!post) return { title: "Post Not Found" };
  const title = post.title;
  const description =
    typeof post.excerpt === "string" && post.excerpt.length > 0
      ? post.excerpt
      : "TechSylph blog post.";
  const imageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).url()
    : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  const locales = ["en", "fr", "de"];
  const posts = await client.fetch<Array<{ slug?: string | { current?: string | null } | null }>>(
    `*[_type == "blogPost"]{ "slug": slug.current }`
  );
  const slugs = (posts ?? [])
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

export default async function BlogSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("blog");
  const post = await client.fetch<BlogPost | null>(BLOG_POST_BY_SLUG_QUERY, {
    slug,
  });

  if (!post) {
    notFound();
  }

  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : null;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "TechSylph blog article.",
    datePublished: post.publishedAt,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: "TechSylph" },
    publisher: { "@type": "Organization", name: "TechSylph" },
    mainEntityOfPage: `https://techsylph.shop/${locale}/blog/${slug}`,
    image: coverImageUrl ? [coverImageUrl] : undefined,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://techsylph.shop/${locale}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `https://techsylph.shop/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://techsylph.shop/${locale}/blog/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-0">
        <nav
          className="font-body text-sm text-text-muted"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="text-text-secondary transition-colors hover:text-brand-green"
          >
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-1">/</span>
          <Link
            href="/blog"
            className="text-text-secondary transition-colors hover:text-brand-green"
          >
            {t("breadcrumbBlog")}
          </Link>
          <span className="mx-1">/</span>
          <span className="text-text-primary">{post.title}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-12">
        {post.category && (
          <span className="badge-green mb-4 inline-block">{post.category}</span>
        )}
        <h1 className="font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
          {post.title}
        </h1>
        {(post.publishedAt || post.author) && (
          <p className="mt-4 font-body text-sm text-text-muted">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            )}
            {post.publishedAt && post.author && " · "}
            {post.author && <span>{post.author}</span>}
          </p>
        )}
        {coverImageUrl && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-surface-1">
            <Image
              src={coverImageUrl}
              alt={`${post.title} cover image`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}
        {post.excerpt && (
          <p className="mt-6 font-body text-lg leading-relaxed text-text-secondary">
            {post.excerpt}
          </p>
        )}
        {post.body && post.body.length > 0 && (
          <div className="mt-8 prose prose-lg max-w-none">
            <PortableTextContent value={post.body} />
          </div>
        )}

        <div className="mt-16 rounded-2xl border border-surface-3 bg-surface-1 p-8 text-center">
          <p className="font-display text-xl font-bold text-text-primary">
            {t("ctaTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md font-body text-sm text-text-secondary">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/rfq" size="md">{t("ctaQuote")}</CTAButton>
            <CTAButton href="/catalog" variant="outline" size="md">{t("ctaCatalog")}</CTAButton>
          </div>
        </div>
      </article>
    </div>
  );
}
