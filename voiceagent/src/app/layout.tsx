import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { CookieNotice } from "@/components/CookieNotice";
import { AppProviders } from "@/components/providers/AppProviders";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${GeistMono.variable} scroll-smooth`}
    >
      <body className="min-h-full bg-bg font-sans text-text antialiased">
        <AppProviders>
          {children}
          <CookieNotice />
        </AppProviders>
      </body>
    </html>
  );
}
