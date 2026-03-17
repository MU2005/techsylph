import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = DM_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "TechSylph",
  description: "TechSylph",
  icons: {
    icon: [
      { url: "/logo-ts-removebg-preview.png", type: "image/png", sizes: "32x32" },
      { url: "/logo-ts-removebg-preview.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/logo-ts-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
