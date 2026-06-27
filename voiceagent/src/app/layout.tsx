import type { Metadata, Viewport } from "next";
import { DeferredSiteWidgets } from "@/components/DeferredSiteWidgets";
import { MarketingProviders } from "@/components/providers/MarketingProviders";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const siteUrl = `https://${BRAND.domain}`;
const description =
  "Canadian voice AI for salons, clinics, and local service businesses. Answer calls 24/7, book appointments, sync CRM, and warm-transfer with PIPEDA-aligned controls.";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description,
  authors: [{ name: BRAND.name, url: siteUrl }],
  metadataBase: new URL(siteUrl),
  alternates: {
    languages: { "en-CA": siteUrl, "fr-CA": `${siteUrl}/fr` },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-inter: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                --font-geist-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                --font-geist-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              }
              html, body { background:#0a0a0a !important; color:#fafafa !important; }
              h1, h2, h3, h4, p, a, button, li, span, label { color: inherit; }
              .text-text, h1, h2 { color: #fafafa; }
              .text-muted { color: #a1a1aa; }
              .gradient-text { color: #0d9488; }
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-bg font-sans text-text antialiased">
        <MarketingProviders>
          {children}
          <DeferredSiteWidgets />
        </MarketingProviders>
      </body>
    </html>
  );
}
