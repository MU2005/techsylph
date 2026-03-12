import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTAButton } from "@/components/shared/CTAButton";
import { CheckCircle2, Tag, Shirt, Package, Repeat } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Private Label — OEM & ODM Manufacturing",
  description:
    "Launch your clothing brand with TechSylph's private label service. Custom labels, packaging, OEM & ODM from Pakistan. MOQ from 100 pcs.",
};

const INCLUDED_SERVICES = [
  "Custom woven or printed labels & hangtags",
  "Branded packaging and poly bags",
  "Custom colorways and fabric selection",
  "Exclusive designs — OEM & ODM available",
];

const CAPABILITIES = [
  {
    icon: Tag,
    title: "Label & Branding",
    text: "Custom woven labels, printed tags, brand hangtags, and care labels.",
  },
  {
    icon: Shirt,
    title: "Fabric & Design",
    text: "Choose from our fabric library or bring your own specs. Custom cuts, fits, and colorways.",
  },
  {
    icon: Package,
    title: "Custom Packaging",
    text: "Branded poly bags, tissue paper, boxes, and retail-ready packaging.",
  },
  {
    icon: Repeat,
    title: "OEM & ODM",
    text: "Manufacture your existing designs (OEM) or let our team create new ones (ODM) from your brief.",
  },
];

export default async function CustomLabelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              label="Private Label Service"
              title="Your Brand,"
              highlight="Our Manufacturing"
              subtitle="Launch or scale your clothing brand with TechSylph's full private label and OEM manufacturing service. From concept to delivery — we handle it all."
            />
            <div className="mt-8">
              <CTAButton href={`/${locale}/rfq`} variant="primary" size="lg">
                Start Your Custom Order
              </CTAButton>
            </div>
          </div>
          <div className="card-base rounded-2xl p-8">
            <ul className="divide-y divide-surface-border">
              {INCLUDED_SERVICES.map((service, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 py-3 last:border-0"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-brand-green" />
                  <span className="font-body text-sm text-text-secondary">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-alt py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Our Services"
            title="Custom Label"
            highlight="Capabilities"
            centered
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="card-base p-6">
                <div className="gradient-bg flex size-12 items-center justify-center rounded-xl">
                  <cap.icon className="size-6 text-white" />
                </div>
                <h3 className="mt-4 font-display font-bold text-text-primary">
                  {cap.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
                  {cap.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-base p-6">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Minimum Order
              </h3>
              <p className="mt-2 font-display text-4xl font-bold gradient-text">
                100 pieces per style
              </p>
              <p className="mt-1 font-body text-sm text-text-muted">
                for private label orders
              </p>
            </div>
            <div className="card-base p-6">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Turnaround Time
              </h3>
              <p className="mt-2 font-display text-4xl font-bold gradient-text">
                4–6 weeks
              </p>
              <p className="mt-1 font-body text-sm text-text-muted">
                from design approval
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
