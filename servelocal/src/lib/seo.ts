import type { Metadata } from "next";
import { SERVE_LOCAL } from "@/lib/constants";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";

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

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} · ${SERVE_LOCAL.name}`,
      description,
      url: `${appUrl}${canonicalPath}`,
      siteName: SERVE_LOCAL.name,
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SERVE_LOCAL.name}`,
      description,
    },
  };
}
