const buckets = new Map<string, number[]>();

/** Simple in-memory IP rate limiter for serverless (best-effort per instance). */
export function isRateLimited(ip: string, maxHits: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= maxHits) return true;
  hits.push(now);
  buckets.set(ip, hits);
  return false;
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
