import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, MessageCircle, MapPin, Clock, Instagram, Linkedin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TechSylph. WhatsApp, email, or contact form. We respond within 24 hours to all inquiries.",
};
export const revalidate = 3600;

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+923001234567";
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

      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="card-base p-8">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-2">
            <h3 className="font-display text-xl font-bold text-text-primary">
              {t("contactInfo")}
            </h3>
            <div className="mt-4 space-y-0">
              <div className="card-base flex items-start gap-4 p-5">
                <div className="icon-box shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">{t("emailUs")}</p>
                  <a
                    href={CONTACT_MAILTO}
                    className="font-body text-brand-green hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
              <div className="card-base mt-3 flex items-start gap-4 p-5">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="size-5 text-white" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">{t("whatsAppLabel")}</p>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-text-primary hover:text-brand-green transition-colors"
                  >
                    {whatsappNumber}
                  </a>
                  <p className="mt-0.5 font-body text-xs text-text-muted">
                    {t("whatsAppHours")}
                  </p>
                </div>
              </div>
              <div className="card-base mt-3 flex items-start gap-4 p-5">
                <div className="icon-box shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">{t("locationLabel")}</p>
                  <span className="font-body text-text-primary">
                    Sialkot, Punjab, Pakistan
                  </span>
                  <p className="mt-0.5 font-body text-xs text-text-muted">
                    {t("locationSubtext")}
                  </p>
                </div>
              </div>
              <div className="card-base mt-3 flex items-start gap-4 p-5">
                <div className="icon-box shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">
                    {t("responseTimeLabel")}
                  </p>
                  <span className="font-body text-text-primary">
                    {t("responseTimeValue")}
                  </span>
                  <p className="mt-0.5 font-body text-xs text-text-muted">
                    {t("responseTimeSubtext")}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 font-body text-xs uppercase tracking-wider text-text-muted">
              {t("followUs")}
            </p>
            <div className="mt-3 flex gap-3">
              <a
                href="https://www.instagram.com/techsylph/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="card-base flex size-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:text-brand-green"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/tech-sylph-b744823b8/"
                target="_blank"
                rel="noopener noreferrer"
                className="card-base flex size-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:text-brand-green"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </aside>
        </div>
        <section className="mt-10 card-base p-6">
          <h2 className="font-display text-2xl font-bold text-text-primary">Helpful links before you reach out</h2>
          <p className="mt-2 font-body text-sm text-text-secondary">
            If you want faster quoting, review our process and submit your requirements directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 font-body text-sm">
            <Link href="/rfq" className="text-brand-green hover:underline">Request a wholesale quote</Link>
            <Link href="/how-it-works" className="text-brand-green hover:underline">See how ordering works</Link>
            <Link href="/custom-label" className="text-brand-green hover:underline">Explore private label services</Link>
            <Link href="/faq" className="text-brand-green hover:underline">Read common buyer FAQs</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
