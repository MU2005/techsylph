import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { client } from "@/sanity/lib/client";
import { FAQ_QUERY } from "@/sanity/lib/queries";
import JsonLd from "@/components/shared/JsonLd";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "FAQ — Common Questions",
  description:
    "Answers to common questions about ordering from TechSylph. MOQ, private label, shipping, samples, payment, and more.",
};
export const revalidate = 300;

const FALLBACK_FAQS = [
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "Our standard MOQ starts from 50 pieces per style. If you need advanced private label customization, we'll guide you on the best minimums for your exact requirement.",
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
      "Standard production takes 15–20 business days after sample approval and order confirmation. More complex customizations can take longer and we confirm timeline before you pay.",
  },
  {
    question: "Can I get a sample before placing a bulk order?",
    answer:
      "Yes. We offer pre-production samples. Sample lead time is usually 7–10 business days, and sample cost is reimbursed against your first bulk order.",
  },
  {
    question: "How do I get pricing?",
    answer:
      "We don't display prices publicly because pricing depends on quantity, customization, and fabric. Submit an RFQ and we'll send a detailed quote within 24 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Payoneer and T/T (bank transfer). Standard payment terms are 50% advance and 50% before shipment.",
  },
  {
    question: "Are your products certified?",
    answer:
      "We work to international quality standards and can provide relevant fabric/compliance documentation on request.",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={faqSchema} />
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          as="h1"
          label="FAQ"
          title="Frequently Asked"
          highlight="Questions"
          subtitle="Everything you need to know about ordering from TechSylph."
        />
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <FAQAccordion items={items} locale={locale} />
        <section className="mt-8 card-base p-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">Related resources for buyers</h2>
          <div className="mt-4 flex flex-wrap gap-4 font-body text-sm">
            <Link href="/custom-label" className="text-brand-green hover:underline">Private label manufacturing service</Link>
            <Link href="/how-it-works" className="text-brand-green hover:underline">Ordering and production process</Link>
            <Link href="/catalog" className="text-brand-green hover:underline">Browse export-ready catalog</Link>
            <Link href="/rfq" className="text-brand-green hover:underline">Request your quote</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
