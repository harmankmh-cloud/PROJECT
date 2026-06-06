import type { NextRequest } from "next/server";

/** Public HTTPS base URL for Twilio webhooks (never localhost). */
export function getPublicAppUrl(request?: NextRequest) {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (env && !env.includes("localhost") && !env.includes("127.0.0.1")) {
    return env;
  }

  if (request) {
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "";
    const proto = request.headers.get("x-forwarded-proto") || "https";

    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      return `${proto}://${host}`;
    }
  }

  return env || "http://localhost:3002";
}
