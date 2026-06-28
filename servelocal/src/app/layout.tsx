import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SERVE_LOCAL } from "@/lib/constants";
import { canonicalBaseUrl } from "@/lib/seo";
import { AppProviders } from "@/components/providers/AppProviders";
import { SuggestionButton } from "@/components/SuggestionButton";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const appUrl = canonicalBaseUrl;
const defaultDescription =
  "Find trusted local trades in BC. Browse plumbers, electricians, and more — call direct, no middleman.";
const defaultImage = `${appUrl}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${SERVE_LOCAL.name} — ${SERVE_LOCAL.tagline}`,
    template: `%s · ${SERVE_LOCAL.name}`,
  },
  description: defaultDescription,
  alternates: { canonical: appUrl },
  verification: {
    // TODO: Set GOOGLE_SITE_VERIFICATION to the Search Console token before launch verification.
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: `${SERVE_LOCAL.name} — ${SERVE_LOCAL.tagline}`,
    description: defaultDescription,
    url: appUrl,
    siteName: SERVE_LOCAL.name,
    locale: "en_CA",
    type: "website",
    images: [{ url: defaultImage, width: 1200, height: 630, alt: SERVE_LOCAL.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SERVE_LOCAL.name} — ${SERVE_LOCAL.tagline}`,
    description: defaultDescription,
    images: [defaultImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${jakarta.variable} ${inter.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <AppProviders>
          {children}
          <SuggestionButton />
          <GoogleAnalytics />
        </AppProviders>
      </body>
    </html>
  );
}
