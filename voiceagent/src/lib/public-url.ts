import type { NextRequest } from "next/server";

function isLocalHost(host: string) {
  return host.includes("localhost") || host.includes("127.0.0.1");
}

/** Public HTTPS base URL for Twilio webhooks (never localhost). */
export function getPublicAppUrl(request?: NextRequest) {
  // Prefer the live request host — Twilio hits ngrok directly; env may be stale.
  if (request) {
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "";
    const proto = request.headers.get("x-forwarded-proto") || "https";

    if (host && !isLocalHost(host)) {
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (env && !isLocalHost(env)) {
    return env.startsWith("http://")
      ? env.replace("http://", "https://")
      : env;
  }

  return env || "http://localhost:3002";
}
