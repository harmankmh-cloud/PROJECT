/**
 * Lightweight fixed-window rate limiter.
 *
 * NOTE ON SCOPE: this is an in-process limiter. On serverless (Vercel) each
 * instance keeps its own counters, so the effective limit is per-instance, not
 * global. It meaningfully slows abuse from a single client hitting a warm
 * instance, but is not a hard global guarantee. For a strict global limit,
 * back this with a shared store (e.g. Upstash Redis / @upstash/ratelimit) by
 * swapping the `hits` map for a Redis INCR+EXPIRE — the call sites below do not
 * need to change.
 */

type Bucket = number[];

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

/** Periodically drop empty/expired buckets so the map can't grow unbounded. */
function sweep(windowMs: number, now: number) {
  if (now - lastSweep < windowMs) return;
  lastSweep = now;
  for (const [key, hits] of buckets) {
    const fresh = hits.filter((t) => now - t < windowMs);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

export interface RateLimitResult {
  limited: boolean;
  /** Seconds until the caller may retry (for the Retry-After header). */
  retryAfter: number;
  remaining: number;
}

export interface RateLimitOptions {
  /** Unique bucket name so different endpoints don't share counters. */
  key: string;
  limit: number;
  windowMs: number;
}

export function rateLimit(
  identifier: string,
  { key, limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  sweep(windowMs, now);

  const bucketKey = `${key}:${identifier}`;
  const hits = (buckets.get(bucketKey) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { limited: true, retryAfter, remaining: 0 };
  }

  hits.push(now);
  buckets.set(bucketKey, hits);
  return { limited: false, retryAfter: 0, remaining: limit - hits.length };
}

/** Extract a best-effort client IP from the request headers. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
