import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { WhyUsFeatureCard } from "@/components/home/WhyUsFeatureCard";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Why Choose TechSylph — Our Advantage",
  description:
    "Why international buyers choose TechSylph: factory-direct quality, MOQ from 50, 24-hour quote response, and door-to-door delivery.",
};
export const revalidate = 3600;

const FEATURES = [
  {
    num: "01",
    icon: "ShieldCheck",
    title: "Quality Assurance",
    desc: "Multi-point QC inspection on every order. International fabric standards. Pre-shipment samples available.",
    stat: "100% QC Checked",
  },
  {
    num: "02",
    icon: "TrendingDown",
    title: "MOQ from 50 Pieces",
    desc: "Start at 50 pieces per style so you can test confidently, then scale with the same manufacturing partner.",
    stat: "From 50 pcs",
  },
  {
    num: "03",
    icon: "Globe",
    title: "Global Shipping",
    desc: "Experienced with US, EU, UK, Middle East & beyond. Full export documentation and logistics support.",
    stat: "20+ Countries",
  },
  {
    num: "04",
    icon: "Palette",
    title: "Custom Branding",
    desc: "Full OEM & ODM. Your labels, your tags, your packaging. We handle it all.",
    stat: "Full Private Label",
  },
  {
    num: "05",
    icon: "Timer",
    title: "Fast, Clear Timelines",
    desc: "Quote response within 24 hours and production in 15–20 business days for standard orders.",
    stat: "24h + 15–20 Days",
  },
  {
    num: "06",
    icon: "HeadphonesIcon",
    title: "Dedicated Support",
    desc: "Direct communication with our team. No middlemen. WhatsApp, email, and video calls available.",
    stat: "Direct Line",
  },
];

const COMPARISON_ROWS = [
  { feature: "MOQ", techsylph: "50 pieces", typical: "500–1000 pieces" },
  { feature: "Quote Response", techsylph: "Within 24 hours", typical: "2–5 business days" },
  { feature: "Production Lead Time", techsylph: "15–20 business days", typical: "30–60 days" },
  { feature: "Communication", techsylph: "Direct (WhatsApp/Email)", typical: "Through agents" },
  { feature: "Private Label", techsylph: "✅ Full service", typical: "Limited", check: true, cross: true },
  { feature: "Quality Check", techsylph: "✅ Every order", typical: "Inconsistent", check: true, cross: true },
  { feature: "Sample", techsylph: "✅ Available (cost reimbursed)", typical: "Extra cost", check: true, cross: true },
];

export default async function WhyUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          as="h1"
          label="Why Choose Us"
          title="The TechSylph"
          highlight="Advantage"
          subtitle="Here's why brands choose us as a friendly, factory-direct private label manufacturing partner."
        />
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <WhyUsFeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
        <div className="mt-8 card-base p-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">Compare options and move forward</h2>
          <div className="mt-4 flex flex-wrap gap-4 font-body text-sm">
            <Link href="/custom-label" className="text-brand-green hover:underline">Private label and OEM capabilities</Link>
            <Link href="/catalog" className="text-brand-green hover:underline">Browse wholesale-ready products</Link>
            <Link href="/how-it-works" className="text-brand-green hover:underline">View ordering process and timelines</Link>
            <Link href="/rfq" className="text-brand-green hover:underline">Request a quote in 24 hours</Link>
          </div>
        </div>
      </div>

      <section className="section-alt py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            label="How We Compare"
            title="TechSylph vs"
            highlight="The Rest"
            centered
          />
          {/* Desktop/tablet: keep the table layout */}
          <div className="card-base mt-12 hidden overflow-hidden rounded-2xl sm:block">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-green-light">
                  <th className="px-6 py-4 font-display text-sm font-bold text-brand-green">
                    Feature
                  </th>
                  <th className="px-6 py-4 font-display text-sm font-bold text-brand-green">
                    TechSylph
                  </th>
                  <th className="px-6 py-4 font-display text-sm font-bold text-brand-green">
                    Typical Suppliers
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-surface-1" : "bg-white"}
                  >
                    <td className="border-t border-surface-border px-6 py-4 font-body text-sm text-text-secondary">
                      {row.feature}
                    </td>
                    <td className="border-t border-surface-border px-6 py-4 font-body text-sm font-semibold text-brand-green">
                      {row.techsylph}
                    </td>
                    <td className="border-t border-surface-border px-6 py-4 font-body text-sm text-text-muted">
                      {row.typical}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards so nothing overflows */}
          <div className="mt-6 space-y-3 sm:hidden">
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.feature}
                className={[
                  "rounded-2xl border border-surface-3 px-4 py-3",
                  i % 2 === 0 ? "bg-surface-1" : "bg-white",
                ].join(" ")}
              >
                <p className="font-display text-sm font-semibold text-text-primary">
                  {row.feature}
                </p>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      TechSylph
                    </span>
                    <span className="font-body text-sm font-semibold text-brand-green text-right">
                      {row.techsylph}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Typical Suppliers
                    </span>
                    <span className="font-body text-sm text-text-muted text-right">
                      {row.typical}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
