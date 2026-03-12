import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, MessageCircle, MapPin, Clock, Instagram, Linkedin } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TechSylph. WhatsApp, email, or contact form. We respond within 24–48 hours to all inquiries.",
};

export default async function ContactPage() {
  const t = await getTranslations("contact");
  return (
    <div className="min-h-screen bg-surface-1">
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <SectionHeading
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
              Contact Information
            </h3>
            <div className="mt-4 space-y-0">
              <div className="card-base flex items-start gap-4 p-5">
                <div className="icon-box shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">Email Us</p>
                  <a
                    href="mailto:hello@techsylph.shop"
                    className="font-body text-brand-green hover:underline"
                  >
                    hello@techsylph.shop
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
                  <p className="font-body text-xs text-text-muted">WhatsApp</p>
                  <span className="font-body text-text-primary">
                    +92 300 123 4567
                  </span>
                  <p className="mt-0.5 font-body text-xs text-text-muted">
                    Available Mon–Sat, 9am–6pm PKT
                  </p>
                </div>
              </div>
              <div className="card-base mt-3 flex items-start gap-4 p-5">
                <div className="icon-box shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">Location</p>
                  <span className="font-body text-text-primary">
                    Sialkot, Punjab, Pakistan
                  </span>
                  <p className="mt-0.5 font-body text-xs text-text-muted">
                    Pakistan&apos;s textile manufacturing hub
                  </p>
                </div>
              </div>
              <div className="card-base mt-3 flex items-start gap-4 p-5">
                <div className="icon-box shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted">
                    Response Time
                  </p>
                  <span className="font-body text-text-primary">
                    Within 24–48 hours
                  </span>
                  <p className="mt-0.5 font-body text-xs text-text-muted">
                    For all inquiries and quotes
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 font-body text-xs uppercase tracking-wider text-text-muted">
              Follow Us
            </p>
            <div className="mt-3 flex gap-3">
              <Link
                href="#"
                className="card-base flex size-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:text-brand-green"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </Link>
              <Link
                href="#"
                className="card-base flex size-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:text-brand-green"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
