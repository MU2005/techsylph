import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTAButton } from "@/components/shared/CTAButton";
import { FileDown, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Download Catalog — TechSylph Lookbook",
  description:
    "Download TechSylph's free product catalog PDF. Full apparel collection with specs, MOQ details, and custom options.",
};
export const revalidate = 3600;

const PILLS = [
  "📄 PDF Format",
  "🔄 Updated 2024",
  "📦 All Categories",
  "💼 B2B Pricing Guide",
];

export default async function LookbookPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          as="h1"
          label="Product Catalog"
          title="Download Our"
          highlight="Lookbook"
          subtitle="Get our full product catalog with all styles, fabric specs, MOQ details, and custom options in one PDF."
          centered
        />
      </header>

      <div className="mx-auto max-w-2xl px-6 pb-20 text-center">
        <div className="card-base rounded-2xl p-10">
          <FileDown className="mx-auto size-16 text-brand-green" />
          <h2 className="mt-4 font-display text-2xl font-bold text-text-primary">
            TechSylph Product Catalog 2024
          </h2>
          <p className="mt-2 font-body text-sm text-text-secondary">
            Complete collection — Apparel, Activewear & Private Label
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {PILLS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-surface-3 bg-white px-4 py-2 font-body text-xs text-text-secondary"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="/lookbook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-0 px-8 py-4 font-body font-semibold text-white shadow-sm transition-all duration-200 gradient-bg hover:opacity-90"
            >
              <Download className="mr-2 size-5" />
              Download Free Catalog
            </a>
            <p className="mt-3 font-body text-xs text-text-muted">
              No email required · Instant download
            </p>
          </div>
          <div className="mt-8 border-t border-surface-3 pt-8">
            <p className="font-body text-sm text-text-secondary">
              Or request a personalized catalog
            </p>
            <div className="mt-3">
              <CTAButton href="/contact" variant="outline" size="md">
                Request Custom Catalog
              </CTAButton>
            </div>
          </div>
          <div className="mt-8 border-t border-surface-3 pt-8 text-left">
            <h2 className="font-display text-xl font-bold text-text-primary">Next best actions</h2>
            <div className="mt-3 flex flex-wrap gap-4 font-body text-sm">
              <Link href="/catalog" className="text-brand-green hover:underline">Explore live catalog pages</Link>
              <Link href="/custom-label" className="text-brand-green hover:underline">Review custom private label options</Link>
              <Link href="/how-it-works" className="text-brand-green hover:underline">Understand the order workflow</Link>
              <Link href="/rfq" className="text-brand-green hover:underline">Request a wholesale quote</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
