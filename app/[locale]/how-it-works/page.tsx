import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { HowItWorksStepRow } from "@/components/home/HowItWorksStepRow";

export const metadata: Metadata = {
  title: "How It Works — Order Process",
  description:
    "See how easy it is to order from TechSylph. Simple steps from inquiry to delivery. Get a quote in 24 hours.",
};
export const revalidate = 3600;

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
    desc: "Our team reviews your requirement and sends a clear quote within 24 hours — including pricing, timeline, and sample options.",
    time: "Within 24 hours",
  },
  {
    title: "Approve Sample & Confirm",
    desc: "We produce a pre-production sample for your approval. Once you're happy with the quality, colors, and fit — you confirm the order.",
    time: "3–5 business days",
  },
  {
    title: "Production Begins",
    desc: "Full production starts after order confirmation and 50% advance payment. We keep you updated at every stage.",
    time: "15–20 business days",
  },
  {
    title: "Shipment & Delivery",
    desc: "Your order is quality-checked, packed, and shipped door-to-door with full export documentation and tracking.",
    time: "USA: 5–8 days | UK/EU: 4–7 days",
  },
];

const NEXT_STEPS = [
  {
    title: "Browse catalog by product type",
    href: "/catalog",
    helper: "Compare categories and shortlist styles for your order.",
  },
  {
    title: "See private label customization options",
    href: "/custom-label",
    helper: "Review branding, labels, packaging, and finishing choices.",
  },
  {
    title: "Review MOQ, sample, and shipping FAQs",
    href: "/faq",
    helper: "Get quick clarity on minimums, lead times, and logistics.",
  },
  {
    title: "Talk to our sourcing team",
    href: "/contact",
    helper: "Share your requirement and get guidance before you submit an RFQ.",
  },
];

export default async function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          as="h1"
          label="The Process"
          title="How To Order From"
          highlight="TechSylph"
          subtitle="From first inquiry to final delivery, we keep the process simple, transparent, and friendly."
        />
      </header>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <HowItWorksStepRow key={step.title} step={step} index={i} />
          ))}
        </div>
        <section className="mt-10 card-base p-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Next steps for your order
          </h2>
          <div className="mt-4 flex flex-wrap gap-4 font-body text-sm">
            {NEXT_STEPS.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className="text-brand-green hover:underline"
              >
                {step.title}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center shadow-xl md:px-14 md:py-16"
            style={{
              background: "linear-gradient(135deg, #047857 0%, #059669 40%, #10B981 100%)",
              boxShadow: "0 25px 50px -12px rgba(5, 150, 105, 0.25), 0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
          >
            <div
              className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-2xl"
              aria-hidden
            />
            <span className="relative inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-white/90">
              Next step
            </span>
            <h2 className="relative mt-5 font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/85 md:text-lg">
              Submit your first RFQ and receive a detailed quote within 24 hours. No commitment required.
            </p>
            <div
              className="relative mx-auto mt-2 h-1 w-20 rounded-full opacity-80"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
              aria-hidden
            />
            <div className="relative mt-8">
              <Link
                href="/rfq"
                className="inline-flex items-center justify-center rounded-full border-0 bg-white px-10 py-4 font-display text-base font-bold text-brand-green shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-green"
              >
                Submit Your First RFQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
