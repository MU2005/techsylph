import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RFQForm } from "@/components/forms/RFQForm";
import { Clock, ShieldCheck, PackageCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Request a Quote — Wholesale Pricing",
  description:
    "Submit an RFQ to TechSylph. Get custom wholesale pricing for apparel orders. No commitment required. Response within 24 hours.",
};
export const revalidate = 3600;

export default async function RfqPage() {
  const t = await getTranslations("rfqPage");
  return (
    <div className="min-h-screen bg-surface-1">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          as="h1"
          label={t("label")}
          title={t("title")}
          highlight={t("highlight")}
          subtitle={t("subtitle")}
        />
      </header>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="card-base p-4 text-center">
            <Clock className="mx-auto size-6 text-brand-green" />
            <p className="mt-1 font-body text-xs text-text-muted">
              {t("statResponse")}
            </p>
          </div>
          <div className="card-base p-4 text-center">
            <ShieldCheck className="mx-auto size-6 text-brand-green" />
            <p className="mt-1 font-body text-xs text-text-muted">
              {t("statCommitment")}
            </p>
          </div>
          <div className="card-base p-4 text-center">
            <PackageCheck className="mx-auto size-6 text-brand-green" />
            <p className="mt-1 font-body text-xs text-text-muted">
              {t("statMoq")}
            </p>
          </div>
        </div>

        <div className="card-base mt-8 rounded-2xl p-8">
          <RFQForm />
        </div>
        <section className="mt-8 card-base p-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">Need more details first?</h2>
          <div className="mt-4 flex flex-wrap gap-4 font-body text-sm">
            <Link href="/catalog" className="text-brand-green hover:underline">Browse wholesale product catalog</Link>
            <Link href="/custom-label" className="text-brand-green hover:underline">View custom private label options</Link>
            <Link href="/faq" className="text-brand-green hover:underline">Check MOQ, sampling, and shipping FAQs</Link>
            <Link href="/contact" className="text-brand-green hover:underline">Talk to our sourcing team</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
