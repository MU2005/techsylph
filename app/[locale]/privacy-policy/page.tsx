import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read TechSylph's privacy policy for details on data collection, communication, and inquiry handling.",
};

export const revalidate = 3600;

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-4xl px-6 pt-32 pb-10">
        <SectionHeading
          as="h1"
          label="Legal"
          title="Privacy"
          highlight="Policy"
          subtitle="How we handle personal and business information submitted through TechSylph."
        />
      </header>
      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="card-base space-y-6 p-8 font-body text-sm leading-relaxed text-text-secondary">
          <p>
            We collect contact and project details that you submit through our forms to provide quotes,
            answer inquiries, and support your sourcing process.
          </p>
          <p>
            We do not sell your personal data. Information is used for communication, order processing,
            and quality of service improvements.
          </p>
          <p>
            If you want your inquiry data removed, contact us at{" "}
            <a href="mailto:hello@techsylph.shop" className="text-brand-green hover:underline">
              hello@techsylph.shop
            </a>.
          </p>
          <div className="border-t border-surface-3 pt-4">
            <p className="text-text-primary">Related pages:</p>
            <div className="mt-2 flex flex-wrap gap-4">
              <Link href="/terms-of-service" className="text-brand-green hover:underline">Terms of Service</Link>
              <Link href="/contact" className="text-brand-green hover:underline">Contact Us</Link>
              <Link href="/rfq" className="text-brand-green hover:underline">Request a Quote</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
