import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  ShieldCheck,
  TrendingDown,
  Globe,
  Palette,
  Timer,
  HeadphonesIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why Choose TechSylph — Our Advantage",
  description:
    "Why 100s of international buyers choose TechSylph. Low MOQ, quality guarantee, fast turnaround, direct communication. Compare us to competitors.",
};

const FEATURES = [
  {
    num: "01",
    icon: ShieldCheck,
    title: "Quality Assurance",
    desc: "Multi-point QC inspection on every order. International fabric standards. Pre-shipment samples available.",
    stat: "100% QC Checked",
  },
  {
    num: "02",
    icon: TrendingDown,
    title: "Competitive MOQ",
    desc: "Start from just 50 pieces per style. No massive commitments required. Scale as your business grows.",
    stat: "From 50 pcs",
  },
  {
    num: "03",
    icon: Globe,
    title: "Global Shipping",
    desc: "Experienced with US, EU, UK, Middle East & beyond. Full export documentation and logistics support.",
    stat: "20+ Countries",
  },
  {
    num: "04",
    icon: Palette,
    title: "Custom Branding",
    desc: "Full OEM & ODM. Your labels, your tags, your packaging. We handle it all.",
    stat: "Full Private Label",
  },
  {
    num: "05",
    icon: Timer,
    title: "Fast Turnaround",
    desc: "4 weeks average from sample approval to delivery. Rush orders available on select products.",
    stat: "~4 Weeks",
  },
  {
    num: "06",
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    desc: "Direct communication with our team. No middlemen. WhatsApp, email, and video calls available.",
    stat: "Direct Line",
  },
];

const COMPARISON_ROWS = [
  { feature: "MOQ", techsylph: "50 pieces", typical: "500–1000 pieces" },
  { feature: "Turnaround", techsylph: "~4 weeks", typical: "8–12 weeks" },
  { feature: "Communication", techsylph: "Direct (WhatsApp/Email)", typical: "Through agents" },
  { feature: "Private Label", techsylph: "✅ Full service", typical: "Limited", check: true, cross: true },
  { feature: "Quality Check", techsylph: "✅ Every order", typical: "Inconsistent", check: true, cross: true },
  { feature: "Sample", techsylph: "✅ Available", typical: "Extra cost", check: true, cross: true },
];

export default async function WhyUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          label="Why Choose Us"
          title="The TechSylph"
          highlight="Advantage"
          subtitle="Here's why hundreds of international buyers choose TechSylph as their apparel sourcing partner."
        />
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-base relative p-6">
              <span
                className="absolute right-4 top-4 font-display text-6xl text-text-primary/5"
                aria-hidden
              >
                {f.num}
              </span>
              <div className="gradient-bg flex size-12 items-center justify-center rounded-xl">
                <f.icon className="size-6 text-white" />
              </div>
              <h3 className="mt-4 font-display font-bold text-text-primary">{f.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
                {f.desc}
              </p>
              <div className="mt-4 border-t border-surface-border pt-4">
                <p className="font-display text-lg font-bold gradient-text">
                  {f.stat}
                </p>
              </div>
            </div>
          ))}
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
          <div className="card-base mt-12 overflow-hidden rounded-2xl">
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
                    className={
                      i % 2 === 0 ? "bg-surface-1" : "bg-white"
                    }
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
        </div>
      </section>
    </div>
  );
}
