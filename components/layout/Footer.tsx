import Image from "next/image";
import {
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { AnimatedLine } from "@/components/shared/ScrollAnimations";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

const FOOTER_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/catalog", key: "catalog" as const },
  { href: "/custom-label", key: "customLabel" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/why-us", key: "whyUs" as const },
  { href: "/about", key: "about" as const },
  { href: "/faq", key: "faq" as const },
  { href: "/rfq", key: "getQuote" as const },
] as const;

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+923001234567";

  return (
    <footer className="relative bg-brand-dark">
      <div className="absolute left-0 right-0 top-0">
        <AnimatedLine
          direction="horizontal"
          className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          origin="center"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image
                src="/logo-ts-removebg-preview.png"
                alt="TechSylph"
                width={48}
                height={48}
                className="h-11 w-auto"
              />
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                TechSylph
              </span>
            </Link>
            <p className="font-body text-sm font-medium text-white/70">{t("tagline")}</p>
            <p className="max-w-md font-body text-sm leading-relaxed text-white/55">
              {t("description")}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://www.instagram.com/techsylph/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-xs font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/tech-sylph-b744823b8/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-xs font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {t("explore")}
            </h3>
            <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {FOOTER_LINKS.map(({ href, key }) => (
                <li key={href + key}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                {t("contact")}
              </h3>
              <ul className="mt-5 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-accent" />
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {whatsappNumber}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-accent" />
                  <a
                    href={CONTACT_MAILTO}
                    className="break-all font-body text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" />
                  <span className="font-body text-sm text-white/70">
                    Sialkot, Punjab, Pakistan
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-body text-xs text-white/35">
              © {new Date().getFullYear()} TechSylph. {t("rights")}
            </p>
            <div className="flex gap-4 font-body text-xs text-white/35">
              <Link href="/privacy-policy" className="transition-colors hover:text-white/55">
                {t("privacy")}
              </Link>
              <span aria-hidden>·</span>
              <Link href="/terms-of-service" className="transition-colors hover:text-white/55">
                {t("terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
