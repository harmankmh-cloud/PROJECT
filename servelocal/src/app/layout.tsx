import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SERVE_LOCAL } from "@/lib/constants";
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

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${SERVE_LOCAL.name} — ${SERVE_LOCAL.tagline}`,
    template: `%s · ${SERVE_LOCAL.name}`,
  },
  description:
    "Find trusted local trades in BC. Browse plumbers, electricians, and more — call direct, no middleman.",
  openGraph: {
    title: `${SERVE_LOCAL.name} — ${SERVE_LOCAL.tagline}`,
    description:
      "Find trusted local trades in BC. Browse plumbers, electricians, and more — call direct, no middleman.",
    url: appUrl,
    siteName: SERVE_LOCAL.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SERVE_LOCAL.name} — ${SERVE_LOCAL.tagline}`,
    description:
      "Find trusted local trades in BC. Browse plumbers, electricians, and more — call direct, no middleman.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={`${jakarta.variable} ${inter.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AppProviders>
          {children}
          <SuggestionButton />
          <GoogleAnalytics />
        </AppProviders>
      </body>
    </html>
  );
}
