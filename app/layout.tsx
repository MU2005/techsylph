import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const bodyFont = DM_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "TechSylph",
  description: "TechSylph",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x35", type: "image/png" },
      {
        url: "/logo-ts-removebg-preview.png",
        type: "image/png",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;
  const lang = locale ?? "en";

  return (
    <html lang={lang}>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased min-h-screen`}
      >
        {children}
        <Toaster />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
