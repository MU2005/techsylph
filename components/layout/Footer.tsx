import {
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const COMPANY_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/why-us", key: "whyUs" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/faq", key: "faq" as const },
] as const;

const PRODUCT_LINKS: Array<
  { key: "categoryTshirts" | "categoryHoodies" | "categoryActivewear" | "categoryCustom" | "viewAllCatalog"; href: string; useFooter?: boolean }
> = [
  { key: "categoryTshirts", href: "/catalog" },
  { key: "categoryHoodies", href: "/catalog" },
  { key: "categoryActivewear", href: "/catalog" },
  { key: "categoryCustom", href: "/catalog" },
  { key: "viewAllCatalog", href: "/catalog", useFooter: true },
];

export default async function Footer() {
  const t = await getTranslations("footer");
  const tCatalog = await getTranslations("catalog");
  const tNav = await getTranslations("nav");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+923001234567";

  return (
    <footer className="border-t border-white/10 bg-brand-dark">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top section: 4 columns */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-xl font-bold text-white">
              TechSylph
            </span>
            <p className="font-body text-sm text-white/60">
              {t("tagline")}
            </p>
            <p className="font-body text-sm leading-relaxed text-white/60">
              {t("description")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white/50 transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="size-[18px]" />
              </a>
              <a
                href="#"
                className="text-white/50 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-[18px]" />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              {t("company")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {COMPANY_LINKS.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Products */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              {t("products")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {PRODUCT_LINKS.map(({ href, key, useFooter }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {useFooter ? t(key) : tCatalog(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              {t("contact")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 shrink-0 text-brand-accent" />
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/60 transition-colors hover:text-white"
                >
                  {whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-brand-accent" />
                <a
                  href="mailto:hello@techsylph.shop"
                  className="font-body text-sm text-white/60 transition-colors hover:text-white"
                >
                  hello@techsylph.shop
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" />
                <span className="font-body text-sm text-white/60">
                  Sialkot, Punjab, Pakistan
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-body text-xs text-white/30">
              © 2025 TechSylph. {t("rights")}
            </p>
            <div className="flex gap-4 font-body text-xs text-white/30">
              <a href="#" className="transition-colors hover:text-white/50">
                {t("privacy")}
              </a>
              <span>·</span>
              <a href="#" className="transition-colors hover:text-white/50">
                {t("terms")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
