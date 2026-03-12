import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTAButton } from "@/components/shared/CTAButton";
import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Pakistan Apparel Export",
  description:
    "Learn about TechSylph — Pakistan's premier B2B apparel export brand based in Sialkot. Our story, mission, and manufacturing capabilities.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              label="Our Story"
              title="Pakistan's Premier"
              highlight="Apparel Exporter"
              subtitle="We connect world-class international buyers with Pakistan's finest textile manufacturing — delivering quality, consistency, and trust on every order."
            />
            <div className="mt-8 flex gap-8">
              <div>
                <p className="font-display text-2xl font-bold gradient-text">
                  Est. 2024
                </p>
                <p className="font-body text-xs uppercase tracking-wider text-text-muted">
                  Founded
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold gradient-text">
                  Sialkot, PK
                </p>
                <p className="font-body text-xs uppercase tracking-wider text-text-muted">
                  Home Base
                </p>
              </div>
            </div>
          </div>
          <div className="card-base rounded-2xl p-8">
            <span
              className="font-display text-6xl text-brand-green/20"
              aria-hidden
            >
              &ldquo;
            </span>
            <p className="font-display text-2xl font-bold leading-snug text-text-primary">
              We don&apos;t just manufacture garments — we build lasting
              partnerships with buyers worldwide.
            </p>
            <p className="mt-4 font-body text-sm text-text-muted">
              — TechSylph Founding Team
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-alt py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="What We Stand For"
            title="Our Mission &"
            highlight="Values"
            centered
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To make Pakistan's world-class textile manufacturing accessible to international buyers of all sizes — from boutique retailers to large distributors.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To become the most trusted name in Pakistani apparel exports, known for quality, transparency, and long-term buyer relationships.",
              },
              {
                icon: Heart,
                title: "Our Values",
                text: "Quality first. Honest communication. Fair pricing. On-time delivery. Every order, every time.",
              },
            ].map((item) => (
              <div key={item.title} className="card-base p-6">
                <div className="gradient-bg flex size-12 items-center justify-center rounded-xl">
                  <item.icon className="size-6 text-white" />
                </div>
                <h3 className="mt-4 font-display font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="card-base p-8">
              <p className="font-body text-sm uppercase tracking-wider text-brand-green">
                🇵🇰 Made in Pakistan
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-text-primary">
                Why Pakistan?
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "3rd largest cotton producer in the world",
                  "100+ years of textile manufacturing heritage",
                  "Competitive pricing without compromising quality",
                  "Government-supported export infrastructure",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-green" />
                    <span className="font-body text-sm leading-relaxed text-text-secondary">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "100+", label: "Years Heritage" },
                { value: "$13B+", label: "Annual Textile Exports" },
                { value: "1M+", label: "Workers Employed" },
                { value: "Top 5", label: "Global Exporter" },
              ].map((stat) => (
                <div key={stat.label} className="card-base p-5 text-center">
                  <p className="font-display text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-body text-xs uppercase text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden section-padding gradient-bg">
        <div className="absolute right-0 top-0 size-64 rounded-full bg-white/5 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 size-48 rounded-full bg-white/5 blur-2xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Partner With Us Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-white/80">
            Join hundreds of international buyers sourcing premium apparel from
            Pakistan&apos;s finest manufacturers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CTAButton href={`/${locale}/catalog`} variant="primary" size="lg" className="bg-white text-brand-green hover:bg-surface-1">
              Browse Catalog
            </CTAButton>
            <CTAButton href={`/${locale}/rfq`} variant="outline" size="lg" className="border-2 border-white/50 text-white hover:bg-white/10">
              Get a Quote
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
