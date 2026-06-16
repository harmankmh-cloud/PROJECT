type AuthMetricName =
  | "getUser.network"
  | "getUser.deduped"
  | "getUser.cache_hit"
  | "signup.network"
  | "signup.deduped"
  | "confirm.verify";

const metrics: Record<string, number> = {};

function metricsEnabled() {
  return (
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_AUTH_METRICS === "1"
  );
}

/** Dev/staging counter — tracks dedupe effectiveness without external deps. */
export function authMetric(name: AuthMetricName) {
  if (!metricsEnabled()) return;
  metrics[name] = (metrics[name] ?? 0) + 1;
}

export function getAuthMetrics() {
  return { ...metrics };
}

export function authLog(event: string, data?: Record<string, unknown>) {
  const payload = { scope: "auth", event, ts: new Date().toISOString(), ...data };
  if (typeof window === "undefined") {
    console.info(JSON.stringify(payload));
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[auth]", payload);
  }
}
