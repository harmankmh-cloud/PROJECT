import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/Toast";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Satoshi-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    "RateLocal helps BC shops collect Google reviews in under a minute — QR poster, AI-written drafts, and private feedback routing.",
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
  alternates: { canonical: appUrl },
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
    <html
      lang="en-CA"
      className={`${jakarta.variable} ${satoshi.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
