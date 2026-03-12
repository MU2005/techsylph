import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RFQForm } from "@/components/forms/RFQForm";
import { Clock, ShieldCheck, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Request a Quote — Wholesale Pricing",
  description:
    "Submit an RFQ to TechSylph. Get custom wholesale pricing for apparel orders. No commitment required. Response within 48 hours.",
};

export default function RfqPage() {
  return (
    <div className="min-h-screen bg-surface-1">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
          label="Request a Quote"
          title="Get Your Custom"
          highlight="Wholesale Quote"
          subtitle="Fill in your requirements and we'll get back to you with a detailed quote within 48 hours. No commitment required."
        />
      </header>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="card-base p-4 text-center">
            <Clock className="mx-auto size-6 text-brand-green" />
            <p className="mt-1 font-body text-xs text-text-muted">
              48hr Response
            </p>
          </div>
          <div className="card-base p-4 text-center">
            <ShieldCheck className="mx-auto size-6 text-brand-green" />
            <p className="mt-1 font-body text-xs text-text-muted">
              No Commitment
            </p>
          </div>
          <div className="card-base p-4 text-center">
            <PackageCheck className="mx-auto size-6 text-brand-green" />
            <p className="mt-1 font-body text-xs text-text-muted">
              From 50 pcs
            </p>
          </div>
        </div>

        <div className="card-base mt-8 rounded-2xl p-8">
          <RFQForm />
        </div>
      </div>
    </div>
  );
}
