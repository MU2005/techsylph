import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTAButton } from "@/components/shared/CTAButton";

export const metadata: Metadata = {
  title: "How It Works — Order Process",
  description:
    "See how easy it is to order from TechSylph. 6 simple steps from inquiry to delivery. Get a quote in 48 hours.",
};

const STEPS = [
  {
    title: "Browse Our Catalog",
    desc: "Explore our full range of apparel — T-shirts, hoodies, activewear, and custom private label options. Use filters to find exactly what you need.",
    time: "~10 minutes",
  },
  {
    title: "Submit Your Inquiry or RFQ",
    desc: "Fill out our Request for Quote form with your product requirements, quantities, and any customization needs. No commitment required at this stage.",
    time: "~5 minutes",
  },
  {
    title: "Receive Your Custom Quote",
    desc: "Our team reviews your requirements and sends a detailed quote within 48 hours — including pricing, production timeline, and available options.",
    time: "Within 48 hours",
  },
  {
    title: "Approve Sample & Confirm",
    desc: "We produce a pre-production sample for your approval. Once you're happy with the quality, colors, and fit — you confirm the order.",
    time: "3–5 business days",
  },
  {
    title: "Production Begins",
    desc: "Full production starts after order confirmation and deposit. We keep you updated throughout with production status reports.",
    time: "2–4 weeks",
  },
  {
    title: "Shipment & Delivery",
    desc: "Your order is quality-checked, packed, and shipped to your location with full export documentation and tracking.",
    time: "5–14 days shipping",
  },
];

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          label="The Process"
          title="How To Order From"
          highlight="TechSylph"
          subtitle="From first inquiry to delivery at your door — here's exactly how it works."
        />
      </header>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-6 border-b border-surface-3 py-8 last:border-0"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full gradient-bg font-display text-lg font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-body text-xs font-semibold uppercase tracking-widest text-brand-green">
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="max-w-2xl font-body text-sm leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
                <span className="mt-2 w-fit rounded-full border border-surface-3 bg-surface-2 px-3 py-1 font-body text-xs text-text-muted">
                  {step.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="section-padding gradient-bg">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 font-body text-lg text-white/80">
            Submit your first RFQ and receive a detailed quote within 48 hours.
          </p>
          <div className="mt-8">
            <CTAButton
              href={`/${locale}/rfq`}
              variant="primary"
              size="lg"
              className="bg-white text-brand-green hover:bg-surface-1"
            >
              Submit Your First RFQ
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
