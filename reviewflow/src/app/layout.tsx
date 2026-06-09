import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://ratelocal.ca";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Get 5-Star Google Reviews with AI + QR Codes | RateLocal BC",
    template: `%s · ${BRAND.name}`,
  },
  description:
    "RateLocal helps BC shops collect Google reviews in under a minute — QR poster, AI-written drafts, and private feedback routing. Built in Fraser Valley.",
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "QR-powered review collection for local businesses. Route unhappy customers privately, help happy ones post on Google in seconds.",
    url: appUrl,
    siteName: BRAND.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "QR-powered review collection for local businesses. Route unhappy customers privately, help happy ones post on Google in seconds.",
  },
  alternates: {
    canonical: appUrl,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={`${jakarta.variable} ${instrument.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
