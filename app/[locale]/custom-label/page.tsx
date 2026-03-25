import type { Metadata } from "next";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { CUSTOM_LABEL_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTAButton } from "@/components/shared/CTAButton";
import { CustomLabelCustomizations } from "@/components/custom-label/CustomLabelCustomizations";
import { CustomLabelProcess } from "@/components/custom-label/CustomLabelProcess";
import type { CustomLabelData } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Custom Private Label — OEM & ODM Manufacturing",
  description:
    "Launch your clothing brand with TechSylph's private label service. Custom labels, packaging, OEM & ODM from Sialkot, Pakistan. MOQ from 50 pcs.",
};
export const revalidate = 300;

const DEFAULT_CUSTOMIZATIONS: NonNullable<CustomLabelData["customizations"]> = [
  {
    title: "Custom Labels & Hangtags",
    description:
      "Woven, printed, or leather patch labels in any size.",
    icon: "Tag",
  },
  {
    title: "Custom Embroidery",
    description:
      "High-density embroidery on chest, sleeve, or back.",
    icon: "Scissors",
  },
  {
    title: "Screen Printing",
    description:
      "Plastisol, water-based, or discharge printing.",
    icon: "Palette",
  },
  {
    title: "Woven Patches",
    description:
      "Custom woven patches sewn or iron-on.",
    icon: "Layers",
  },
  {
    title: "Custom Fabric & GSM",
    description:
      "Choose your weight, weave, and composition.",
    icon: "Package",
  },
  {
    title: "Private Label",
    description:
      "Full white-label — your brand, zero TechSylph presence.",
    icon: "Star",
  },
];

const DEFAULT_PROCESS: NonNullable<CustomLabelData["process"]> = [
  {
    stepNumber: 1,
    title: "Share Your Brief",
    description:
      "Send designs, specs, quantities. We'll confirm feasibility and lead times.",
    duration: "1-2 days",
  },
  {
    stepNumber: 2,
    title: "Sample Development",
    description: "We create a physical sample for your approval.",
    duration: "5-7 days",
  },
  {
    stepNumber: 3,
    title: "Sample Approval",
    description: "Review and approve or request revisions.",
    duration: "Your timeline",
  },
  {
    stepNumber: 4,
    title: "Production",
    description:
      "Full run manufactured and QC checked.",
    duration: "3-4 weeks",
  },
  {
    stepNumber: 5,
    title: "Delivery",
    description: "Shipped to your door with tracking.",
    duration: "5-14 days shipping",
  },
];

function highlightLastWord(text: string) {
  const trimmed = (text || "").trim();
  if (!trimmed) return <></>;
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace === -1) {
    return (
      <span className="gradient-text">{trimmed}</span>
    );
  }
  const before = trimmed.slice(0, lastSpace);
  const last = trimmed.slice(lastSpace + 1);
  return (
    <>
      {before} <span className="gradient-text">{last}</span>
    </>
  );
}

export default async function CustomLabelPage() {
  const data = await client
    .fetch<CustomLabelData | null>(CUSTOM_LABEL_QUERY)
    .catch(() => null);

  const headline = data?.heroHeadline ?? "Your Brand. Our Manufacturing.";
  const subtitle = data?.heroSubtitle ?? "Full custom label and private label manufacturing from Pakistan. MOQ from 50 pieces.";
  const moqNote = data?.moqNote ?? "Minimum order from 50 pieces per style";
  const turnaroundNote =
    data?.turnaroundNote ?? "Typical production: 15–20 business days after sample approval";
  const customizations =
    Array.isArray(data?.customizations) && data.customizations.length > 0
      ? data.customizations
      : DEFAULT_CUSTOMIZATIONS;
  const processSteps =
    Array.isArray(data?.process) && data.process.length > 0
      ? data.process
      : DEFAULT_PROCESS;

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-white pt-32 pb-16"
        aria-label="Hero"
      >
        <div
          className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-100 opacity-60 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="badge-green">Private Label & Custom</span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
                {highlightLastWord(headline)}
              </h1>
              <p className="mt-4 max-w-lg font-body text-lg text-text-secondary">
                {subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-surface-border bg-white px-4 py-2 font-body text-sm text-text-secondary shadow-sm">
                  🕐 {turnaroundNote}
                </span>
                <span className="rounded-full border border-surface-border bg-white px-4 py-2 font-body text-sm text-text-secondary shadow-sm">
                  📦 {moqNote}
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <CTAButton
                  href="/rfq?type=custom"
                  variant="primary"
                  size="lg"
                  className="rounded-xl px-7 py-3.5"
                >
                  Request Custom Quote
                </CTAButton>
                <CTAButton
                  href="/contact"
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-surface-3 px-7 py-3.5"
                >
                  Contact Us
                </CTAButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50+", label: "Min. Order Qty" },
                { value: "6", label: "Customization Types" },
                { value: "3-4 Wks", label: "Avg. Turnaround" },
                { value: "100%", label: "Custom Branding" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="card-base rounded-2xl p-5 text-center"
                >
                  <p className="font-display text-3xl font-bold text-brand-green">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-body text-sm text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Customization Options */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="What We Offer"
            title="Every Detail,"
            highlight="Your Way"
            subtitle="From labels to fabric — full customization at every level."
            centered
          />
          <CustomLabelCustomizations customizations={customizations} />
        </div>
      </section>

      {/* Section 3: How It Works (Process) */}
      <section className="section-padding bg-surface-1">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            label="The Process"
            title="Simple Steps to"
            highlight="Your Custom Order"
            centered
          />
          <CustomLabelProcess steps={processSteps} />
        </div>
      </section>

      {/* Section 4: CTA card */}
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl bg-emerald-50 p-10 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Ready to Start Your Custom Order?
          </h2>
          <p className="mt-2 font-body text-text-secondary">
            Get a factory-direct quote within 24 hours — no commitment needed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <CTAButton
              href="/rfq?type=custom"
              variant="primary"
              size="lg"
            >
              Request a Quote
            </CTAButton>
            <CTAButton href="/contact" variant="outline" size="lg">
              Contact Us
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
