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
  "Enterprise AI phone agents for local businesses. Inbound support, appointment booking, warm transfer, and compliance built in.";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
