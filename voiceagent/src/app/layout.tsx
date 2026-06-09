import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CookieNotice } from "@/components/CookieNotice";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = `https://${BRAND.domain}`;
const description =
  "Canadian voice AI for salons, clinics, and local service businesses. Answer calls 24/7, book appointments, sync CRM, and warm-transfer with PIPEDA-aligned controls.";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description,
  authors: [{ name: BRAND.name, url: siteUrl }],
  metadataBase: new URL(siteUrl),
  alternates: {
    languages: { "en-CA": siteUrl, "fr-CA": siteUrl },
  },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-full bg-obsidian font-sans text-on-surface antialiased">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
