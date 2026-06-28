import type { Metadata } from "next";
import { tradeSeoPlural } from "@/lib/category-copy";
import { SERVE_LOCAL, cityName } from "@/lib/constants";

export const canonicalBaseUrl = "https://www.servelocal.ca";

function canonicalUrl(path: string) {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  return `${canonicalBaseUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
}

export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function tradeListingTitle({
  trade,
  tradeSlug,
  citySlug,
}: {
  trade: string;
  tradeSlug?: string;
  citySlug?: string;
}) {
  const label = tradeSeoPlural(tradeSlug, trade);
  if (citySlug) {
    return `Best ${label} in ${cityName(citySlug)}, BC | Get Free Quotes`;
  }
  return `${trade} Services in Canada | Free Quotes`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = canonicalUrl(canonicalPath);
  const image = `${canonicalBaseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SERVE_LOCAL.name,
      locale: "en_CA",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: SERVE_LOCAL.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
