import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Blog — Apparel Industry Insights",
  description:
    "Read TechSylph's blog for apparel export guides, manufacturing insights, and industry news from Pakistan.",
};

export default async function BlogPage() {
  const t = await getTranslations("blog");
  let posts: BlogPost[] = [];
  try {
    const data = await client.fetch<BlogPost[]>(BLOG_POSTS_QUERY);
    posts = Array.isArray(data) ? data : [];
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          label={t("pageLabel")}
          title={t("pageTitle")}
          highlight={t("pageHighlight")}
          subtitle={t("pageSubtitle")}
          centered={false}
        />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-20">
        {posts.length === 0 ? (
          <div className="card-base p-12 text-center">
            <p className="font-body text-text-secondary">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post.coverImage
                ? urlFor(post.coverImage).width(600).height(360).url()
                : null;
              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="card-base flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-surface-2">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-2" />
                    )}
                    {post.category && (
                      <span className="absolute left-3 top-3 badge-green">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h2 className="font-display text-lg font-semibold leading-snug text-text-primary">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="line-clamp-3 font-body text-sm text-text-secondary">
                        {post.excerpt}
                      </p>
                    )}
                    {post.publishedAt && (
                      <p className="mt-auto font-body text-xs text-text-muted">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                    <span className="font-body text-sm font-medium text-brand-green">
                      {t("readMore")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
