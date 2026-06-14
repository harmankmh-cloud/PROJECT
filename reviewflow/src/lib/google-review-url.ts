const GOOGLE_HOST_PATTERNS = [
  /^https:\/\/g\.page\//i,
  /^https:\/\/maps\.google\./i,
  /^https:\/\/www\.google\.com\/maps\//i,
  /^https:\/\/search\.google\.com\/local\/writereview/i,
  /^https:\/\/maps\.app\.goo\.gl\//i,
];

const RATELOCAL_REVIEW_PAGE = /\/r\/[a-z0-9-]+/i;

export function isLikelyGoogleReviewUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("ratelocal.ca")) return false;
    if (RATELOCAL_REVIEW_PAGE.test(parsed.pathname)) return false;
    return GOOGLE_HOST_PATTERNS.some((pattern) => pattern.test(trimmed));
  } catch {
    return false;
  }
}

export function validateGoogleReviewUrl(url: string): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = url.trim();
  if (!trimmed) return { ok: true, value: "" };

  try {
    new URL(trimmed);
  } catch {
    return { ok: false, error: "Enter a valid URL starting with https://" };
  }

  if (trimmed.includes("ratelocal.ca") || RATELOCAL_REVIEW_PAGE.test(trimmed)) {
    return {
      ok: false,
      error: "That looks like your RateLocal review page — paste your Google Maps “Write a review” link instead.",
    };
  }

  if (!isLikelyGoogleReviewUrl(trimmed)) {
    return {
      ok: false,
      error: "Use your Google Maps review link (g.page, google.com/maps, or maps.app.goo.gl).",
    };
  }

  return { ok: true, value: trimmed };
}
