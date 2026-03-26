import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navbar, Footer, WhatsAppButton } from "@/components/layout";
import JsonLd from "@/components/shared/JsonLd";
import { CONTACT_EMAIL } from "@/lib/contact";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
};

const META_BY_LOCALE: Record<string, { title: string; description: string; ogDescription: string }> = {
  en: {
    title: "TechSylph — Global Apparel Export from Pakistan",
    description: "Pakistan-based premium B2B apparel manufacturer. T-shirts, hoodies, activewear, custom private label. Low MOQ, global shipping. Request a quote today.",
    ogDescription: "Premium B2B apparel manufacturing from Pakistan. Low MOQ, global shipping, custom private label.",
  },
  fr: {
    title: "TechSylph — Export Mondial de Vêtements depuis le Pakistan",
    description: "Fabricant B2B de vêtements au Pakistan. T-shirts, sweats, sportswear, marque privée. MOQ bas, livraison mondiale. Demandez un devis.",
    ogDescription: "Fabrication B2B de vêtements premium au Pakistan. MOQ bas, livraison mondiale, marque privée.",
  },
  de: {
    title: "TechSylph — Globaler Bekleidungsexport aus Pakistan",
    description: "B2B-Bekleidungshersteller in Pakistan. T-Shirts, Hoodies, Sportbekleidung, Private Label. Niedrige MOQ, weltweiter Versand. Angebot anfordern.",
    ogDescription: "Premium B2B-Bekleidungsherstellung aus Pakistan. Niedrige MOQ, weltweiter Versand, Private Label.",
  },
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = META_BY_LOCALE[locale] ?? META_BY_LOCALE.en;
  const ogLocale = OG_LOCALE_MAP[locale] ?? "en_US";

  return {
  metadataBase: new URL("https://techsylph.shop"),
  title: {
    default: meta.title,
    template: "%s | TechSylph",
  },
  description: meta.description,
  keywords: [
    "Pakistan apparel manufacturer",
    "wholesale clothing export",
    "private label clothing Pakistan",
    "bulk t-shirt supplier",
    "custom hoodie manufacturer",
    "B2B apparel export",
    "Sialkot textile manufacturer",
    "activewear manufacturer Pakistan",
  ],
  authors: [{ name: "TechSylph", url: "https://techsylph.shop" }],
  creator: "TechSylph",
  openGraph: {
    type: "website",
    locale: ogLocale,
    url: `https://techsylph.shop/${locale}`,
    siteName: "TechSylph",
    title: meta.title,
    description: meta.ogDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechSylph — Global Apparel Export",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.ogDescription,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    languages: {
      en: "/en",
      fr: "/fr",
      de: "/de",
      "x-default": "/en",
    },
  },
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechSylph",
  url: "https://techsylph.shop",
  logo: "https://techsylph.shop/logo-ts-removebg-preview.png",
  description: "Pakistan-based B2B apparel export manufacturer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sialkot",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: CONTACT_EMAIL,
    availableLanguage: ["English", "French", "German"],
  },
  sameAs: [
    "https://www.instagram.com/techsylph/?hl=en",
    "https://www.linkedin.com/in/tech-sylph-b744823b8/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TechSylph",
  url: "https://techsylph.shop",
  inLanguage: ["en", "fr", "de"],
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Navbar />
      <main>{children}</main>
      <WhatsAppButton />
      <Footer />
    </NextIntlClientProvider>
  );
}
