import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const siteUrl = `https://${BRAND.domain}`;
const description =
  "AI phone agents for salons, clinics, and local service businesses. Answer calls 24/7, book appointments, sync CRM, and warm-transfer with compliance built in.";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description,
  authors: [{ name: BRAND.name, url: siteUrl }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: { "en-CA": siteUrl, "fr-CA": siteUrl },
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
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface font-sans text-on-surface antialiased">{children}</body>
    </html>
  );
}
