"use client";

import { useState, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AnimatedLine } from "@/components/shared/ScrollAnimations";

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/catalog", key: "catalog" as const },
  { href: "/custom-label", key: "customLabel" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/why-us", key: "whyUs" as const },
  { href: "/about", key: "about" as const },
  { href: "/blog", key: "blog" as const },
] as const;

const LOCALES = [
  { code: "en" as const, label: "EN", flag: "🇬🇧" },
  { code: "fr" as const, label: "FR", flag: "🇫🇷" },
  { code: "de" as const, label: "DE", flag: "🇩🇪" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm transition-all duration-300 relative",
        scrolled && "shadow-md shadow-black/5"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 md:h-20">
        {/* Logo — display font, tighter tracking, gradient on Sylph */}
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-extrabold tracking-tight text-text-primary md:text-2xl"
        >
          Tech<span className="gradient-text">Sylph</span>
        </Link>

        {/* Center nav (desktop) — display font, letter-spacing, pill active state */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-full px-4 py-2.5 font-display text-sm font-semibold tracking-wide text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary",
                isActive(href) &&
                  "bg-brand-green-light/60 text-brand-green-dark hover:bg-brand-green-light hover:text-brand-green-dark"
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right: locale + CTA + mobile trigger */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language switcher (desktop) — bordered pill */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="hidden items-center gap-2 rounded-full border border-surface-border bg-surface-0 px-3.5 py-2 font-display text-sm font-semibold text-text-secondary shadow-sm transition-colors hover:border-brand-green/30 hover:bg-surface-1 hover:text-text-primary md:inline-flex"
            >
              <span className="text-base leading-none">{currentLocale.flag}</span>
              <span>{currentLocale.label}</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[7rem] bg-white text-text-primary">
              {LOCALES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  className={cn(
                    "cursor-pointer font-display font-medium",
                    locale === l.code && "font-bold text-brand-green"
                  )}
                  onSelect={() => router.replace(pathname, { locale: l.code })}
                >
                  <span>{l.flag}</span>
                  <span className="ml-2">{l.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CTA (desktop) — more prominent */}
          <Link
            href="/rfq"
            className={cn(
              "hidden inline-flex items-center justify-center rounded-full px-6 py-3 font-display text-sm font-bold tracking-wide text-white shadow-md transition-all duration-200 hover:shadow-lg hover:opacity-95 md:inline-flex",
              "gradient-bg"
            )}
          >
            {t("getQuote")}
          </Link>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent
              side="top"
              className="border-surface-3 bg-white px-6 pt-6 pb-8 data-[side=top]:max-h-[85vh] data-[side=top]:overflow-y-auto"
              showCloseButton
            >
              <nav className="flex flex-col gap-0.5 pt-10">
                {NAV_LINKS.map(({ href, key }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-full px-4 py-3 text-lg font-display font-semibold transition-colors",
                      isActive(href)
                        ? "bg-brand-green-light/60 text-brand-green-dark"
                        : "text-text-secondary hover:bg-surface-1 hover:text-text-primary"
                    )}
                  >
                    {t(key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-4 border-t border-surface-3 pt-6">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-text-muted">{t("language")}</span>
                  <div className="flex gap-2">
                    {LOCALES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        className={cn(
                          "rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors",
                          locale === l.code
                            ? "bg-brand-green text-white"
                            : "bg-surface-2 text-text-secondary hover:bg-surface-3"
                        )}
                        onClick={() => {
                          router.replace(pathname, { locale: l.code });
                          setMobileOpen(false);
                        }}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Link
                  href="/rfq"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "inline-flex justify-center rounded-full px-6 py-3.5 font-display font-bold tracking-wide text-white shadow-md gradient-bg hover:opacity-95"
                  )}
                >
                  {t("getQuote")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Scroll-animated bottom line (gradient to match brand) */}
      <div className="absolute bottom-0 left-0 right-0">
        <AnimatedLine
          direction="horizontal"
          className="h-px w-full"
          origin="center"
          style={{
            background: "linear-gradient(90deg, #047857, #059669, #10B981, #059669, #047857)",
          }}
        />
      </div>
    </header>
  );
}
