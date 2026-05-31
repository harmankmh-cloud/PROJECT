export function normalizeAppUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export function buildReviewUrl(appUrl: string, slug: string): string {
  return `${normalizeAppUrl(appUrl)}/r/${slug}`;
}

/** Fix QR links when NEXT_PUBLIC_APP_URL was left as localhost on Vercel. */
export function fixReviewUrlForClient(url: string): string {
  if (typeof window === "undefined") return url;
  if (!url.includes("localhost") && !url.includes("127.0.0.1")) return url;

  try {
    const path = new URL(url).pathname;
    return `${window.location.origin}${path}`;
  } catch {
    return url;
  }
}
