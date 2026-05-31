import "server-only";

import { headers } from "next/headers";
import { normalizeAppUrl } from "@/lib/app-url";

export async function getAppUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return normalizeAppUrl(envUrl);
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");

  if (host && !host.includes("localhost") && !host.startsWith("127.0.0.1")) {
    const proto = headerList.get("x-forwarded-proto") ?? "https";
    return normalizeAppUrl(`${proto}://${host}`);
  }

  if (envUrl) return normalizeAppUrl(envUrl);
  return "http://localhost:3000";
}

export { buildReviewUrl } from "@/lib/app-url";
