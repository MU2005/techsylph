import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Private Label Manufacturer in Sialkot",
  description:
    "Learn about TechSylph — a friendly, factory-direct private label apparel manufacturer based in Sialkot, Pakistan.",
};
export const revalidate = 3600;

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              as="h1"
              label="Our Story"
              title="From Sialkot to"
              highlight="the World"
              subtitle="TechSylph is a factory-direct private label manufacturer in Sialkot, Pakistan. We help brands launch and scale with clear communication, honest pricing, and reliable production."
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
              We&apos;re not a middleman. We&apos;re your manufacturing partner —
              and we treat your brand like our own.
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
                text: "To be the most trusted private label apparel partner for brands worldwide, with factory-direct quality and a smooth client experience from inquiry to delivery.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To build a globally recognized manufacturing brand known for reliable execution, honest communication, and long-term partnerships.",
              },
              {
                icon: Heart,
                title: "Our Values",
                text: "Craft first, transparency, partnership over transaction, accessibility through MOQ from 50, and accountability in every order.",
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
                Why Sialkot?
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "3rd largest cotton producer in the world",
                  "100+ years of textile manufacturing heritage",
                  "Global reputation for garment and leather craftsmanship",
                  "Competitive factory-direct pricing without compromising quality",
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
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center shadow-xl md:px-14 md:py-16"
            style={{
              background: "linear-gradient(135deg, #047857 0%, #059669 40%, #10B981 100%)",
              boxShadow: "0 25px 50px -12px rgba(5, 150, 105, 0.25), 0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
          >
            <div className="absolute right-0 top-0 size-64 rounded-full bg-white/5 blur-3xl" aria-hidden />
            <div className="absolute bottom-0 left-0 size-48 rounded-full bg-white/5 blur-2xl" aria-hidden />
            <span className="relative inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-white/90">
              Let&apos;s work together
            </span>
            <h2 className="relative mt-5 font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Partner With Us Today
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/85 md:text-lg">
              Share your requirements and get a factory-direct quote within 24 hours. MOQ starts at 50 pieces per style.
            </p>
            <div
              className="relative mx-auto mt-6 h-px w-24 opacity-60"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
              aria-hidden
            />
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-full border-0 bg-white px-10 py-4 font-display text-base font-bold text-brand-green shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-green"
              >
                Browse Catalog
              </Link>
              <Link
                href="/rfq"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/80 bg-transparent px-10 py-4 font-display text-base font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-green"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
