import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { TRADE_LOCAL } from "@/lib/constants";
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
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${TRADE_LOCAL.name} — ${TRADE_LOCAL.tagline}`,
    template: `%s · ${TRADE_LOCAL.name}`,
  },
  description:
    "Find trusted local trades in BC. Browse plumbers, electricians, and more — call direct, no middleman.",
  openGraph: {
    title: `${TRADE_LOCAL.name} — ${TRADE_LOCAL.tagline}`,
    description:
      "Find trusted local trades in BC. Browse plumbers, electricians, and more — call direct, no middleman.",
    url: appUrl,
    siteName: TRADE_LOCAL.name,
    type: "website",
  },
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
    <html lang="en" className={`${jakarta.variable} ${instrument.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
