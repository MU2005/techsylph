import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read TechSylph's terms of service for inquiry handling, quotations, production terms, and communication policies.",
};

export const revalidate = 3600;

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-4xl px-6 pt-32 pb-10">
        <SectionHeading
          as="h1"
          label="Legal"
          title="Terms of"
          highlight="Service"
          subtitle="General terms for inquiries, quotations, and collaboration with TechSylph."
        />
      </header>
      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="card-base space-y-6 p-8 font-body text-sm leading-relaxed text-text-secondary">
          <p>
            Quotations, lead times, and production details may vary by product specification, quantity,
            and customization requirements.
          </p>
          <p>
            Production starts after sample approval and payment terms confirmation. Delivery timelines depend
            on destination, customs, and selected logistics method.
          </p>
          <p>
            For full order terms or clarifications, contact us before confirming your purchase order.
          </p>
          <div className="border-t border-surface-3 pt-4">
            <p className="text-text-primary">Related pages:</p>
            <div className="mt-2 flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="text-brand-green hover:underline">Privacy Policy</Link>
              <Link href="/how-it-works" className="text-brand-green hover:underline">How It Works</Link>
              <Link href="/contact" className="text-brand-green hover:underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
