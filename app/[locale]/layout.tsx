import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navbar, Footer, WhatsAppButton } from "@/components/layout";
import JsonLd from "@/components/shared/JsonLd";

// TODO: Add a real 1200x630 OG image at public/og-image.jpg
// This is the image shown when links are shared on social media
// Design it with TechSylph logo + tagline on dark background

export const metadata: Metadata = {
  metadataBase: new URL("https://techsylph.shop"),
  title: {
    default: "TechSylph — Global Apparel Export from Pakistan",
    template: "%s | TechSylph",
  },
  description:
    "Pakistan-based premium B2B apparel manufacturer. T-shirts, hoodies, activewear, custom private label. Low MOQ, global shipping. Request a quote today.",
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
    locale: "en_US",
    url: "https://techsylph.shop",
    siteName: "TechSylph",
    title: "TechSylph — Global Apparel Export from Pakistan",
    description:
      "Premium B2B apparel manufacturing from Pakistan. Low MOQ, global shipping, custom private label.",
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
    title: "TechSylph — Global Apparel Export from Pakistan",
    description: "Premium B2B apparel manufacturing from Pakistan.",
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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechSylph",
  url: "https://techsylph.shop",
  logo: "https://techsylph.shop/logo.png",
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
    availableLanguage: ["English", "French", "German"],
  },
  sameAs: [
    "https://www.instagram.com/techsylph",
    "https://www.linkedin.com/company/techsylph",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd data={organizationSchema} />
      <Navbar />
      <main>{children}</main>
      <WhatsAppButton />
      <Footer />
    </NextIntlClientProvider>
  );
}
