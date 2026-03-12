import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { client } from "@/sanity/lib/client";
import { FAQ_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "FAQ — Common Questions",
  description:
    "Answers to common questions about ordering from TechSylph. MOQ, private label, shipping, samples, payment, and more.",
};

const FALLBACK_FAQS = [
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "Our standard MOQ is 50 pieces per style, per color. For private label orders, the MOQ is 100 pieces per style.",
  },
  {
    question: "Do you offer private label / custom branding?",
    answer:
      "Yes. We offer full private label service including custom woven labels, hangtags, packaging, and branded poly bags.",
  },
  {
    question: "What countries do you ship to?",
    answer:
      "We ship worldwide including USA, UK, EU countries, UAE, Saudi Arabia, Canada, Australia, and more.",
  },
  {
    question: "How long does production take?",
    answer:
      "Standard production takes 3–4 weeks after sample approval and order confirmation. Private label may take 4–6 weeks.",
  },
  {
    question: "Can I get a sample before placing a bulk order?",
    answer:
      "Yes. We offer pre-production samples. Sample lead time is 3–5 business days. Sample costs are credited against your bulk order.",
  },
  {
    question: "How do I get pricing?",
    answer:
      "We don't display prices publicly as they depend on quantity, customization, and fabric. Submit an RFQ form and we'll send you a detailed quote within 48 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept T/T (Bank Transfer), Western Union, and other methods. Payment terms: 30% advance, 70% before shipment.",
  },
  {
    question: "Are your products certified?",
    answer:
      "We work to OEKO-TEX standards and can provide fabric certifications on request. GST-certified exporter.",
  },
  {
    question: "Can I visit your factory?",
    answer:
      "Yes, factory visits are welcome by appointment. Located in Sialkot, Punjab, Pakistan.",
  },
  {
    question: "What file formats do you accept for custom designs?",
    answer:
      "We accept AI, PDF, PSD, PNG (300dpi+). For embroidery, we can also work from DST files.",
  },
];

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let items: { _id?: string; question: string; answer: string }[] = [];

  try {
    const data = await client.fetch<{ _id: string; question: string; answer: string }[]>(FAQ_QUERY);
    if (Array.isArray(data) && data.length > 0) {
      items = data;
    }
  } catch {
    // fallback below
  }

  if (items.length === 0) {
    items = FALLBACK_FAQS;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          label="FAQ"
          title="Frequently Asked"
          highlight="Questions"
          subtitle="Everything you need to know about ordering from TechSylph."
        />
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <FAQAccordion items={items} locale={locale} />
      </div>
    </div>
  );
}
