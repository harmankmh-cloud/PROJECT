export function normalizeAppUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export function buildReviewUrl(appUrl: string, slug: string): string {
  return `${normalizeAppUrl(appUrl)}/r/${slug}`;
}

function isLocalHost(url: string): boolean {
  return url.includes("localhost") || url.includes("127.0.0.1");
}

/** Fix QR links when NEXT_PUBLIC_APP_URL was left as localhost on Vercel. */
export function fixReviewUrlForClient(url: string): string {
  if (typeof window === "undefined") return url;
  if (!isLocalHost(url)) return url;

  try {
    const path = new URL(url).pathname;
    return `${window.location.origin}${path}`;
  } catch {
    return url;
  }
}

/**
 * QR codes and share links must use the domain the owner is actually visiting.
 * Avoids broken links when NEXT_PUBLIC_APP_URL points at a dead custom domain.
 */
export function resolvePublicReviewUrl(url: string, slug: string): string {
  if (typeof window === "undefined") return url;

  const origin = window.location.origin;
  if (!isLocalHost(origin)) {
    return buildReviewUrl(origin, slug);
  }

  return fixReviewUrlForClient(url);
}

export function isLocalBrowserOrigin(): boolean {
  if (typeof window === "undefined") return false;
  return isLocalHost(window.location.origin);
}

export function reviewUrlHostMismatch(url: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const configuredHost = new URL(url).host;
    const currentHost = window.location.host;
    return configuredHost !== currentHost && !isLocalHost(window.location.origin);
  } catch {
    return false;
  }
}
