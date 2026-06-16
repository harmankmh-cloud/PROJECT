import "server-only";
import type { NextRequest } from "next/server";
import twilio from "twilio";
import { getPublicAppUrl } from "@/lib/public-url";

export function formDataToParams(formData: FormData): Record<string, string> {
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });
  return params;
}

/** Validate inbound Twilio POST webhooks (skip only in local dev without auth token). */
export function validateTwilioWebhook(
  request: NextRequest,
  formData: FormData
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    return process.env.NODE_ENV !== "production";
  }

  const signature = request.headers.get("x-twilio-signature");
  if (!signature) return false;

  const url = `${getPublicAppUrl(request)}${request.nextUrl.pathname}${request.nextUrl.search}`;
  return twilio.validateRequest(authToken, signature, url, formDataToParams(formData));
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
