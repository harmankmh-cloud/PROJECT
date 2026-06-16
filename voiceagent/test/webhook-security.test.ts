import { generateKeyPairSync, sign } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { validateTelnyxWebhook } from "@/lib/telnyx-webhook";
import { escapeXml, validateTwilioWebhook } from "@/lib/twilio-webhook";

function mockRequest(headers: Record<string, string>): NextRequest {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? headers[name] ?? null,
    },
    nextUrl: {
      pathname: "/api/telnyx/webhook",
      search: "",
    },
  } as NextRequest;
}

describe("validateTelnyxWebhook", () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const publicKeyB64 = publicKey.export({ type: "spki", format: "der" }).toString("base64");

  beforeEach(() => {
    process.env.TELNYX_PUBLIC_KEY = publicKeyB64;
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    delete process.env.TELNYX_PUBLIC_KEY;
    vi.unstubAllEnvs();
  });

  it("accepts a valid Ed25519 signature", () => {
    const rawBody = JSON.stringify({ event_type: "call.initiated" });
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = sign(null, Buffer.from(`${timestamp}|${rawBody}`), privateKey).toString(
      "base64"
    );

    const request = mockRequest({
      "telnyx-signature-ed25519": signature,
      "telnyx-timestamp": timestamp,
    });

    expect(validateTelnyxWebhook(request, rawBody)).toBe(true);
  });

  it("rejects tampered payload", () => {
    const rawBody = JSON.stringify({ event_type: "call.initiated" });
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = sign(null, Buffer.from(`${timestamp}|${rawBody}`), privateKey).toString(
      "base64"
    );

    const request = mockRequest({
      "telnyx-signature-ed25519": signature,
      "telnyx-timestamp": timestamp,
    });

    expect(validateTelnyxWebhook(request, JSON.stringify({ event_type: "call.hijacked" }))).toBe(
      false
    );
  });

  it("rejects when public key is missing in production", () => {
    delete process.env.TELNYX_PUBLIC_KEY;
    vi.stubEnv("NODE_ENV", "production");

    const request = mockRequest({
      "telnyx-signature-ed25519": "abc",
      "telnyx-timestamp": "1",
    });

    expect(validateTelnyxWebhook(request, "{}")).toBe(false);
  });

  it("rejects when signature headers are missing", () => {
    expect(validateTelnyxWebhook(mockRequest({}), "{}")).toBe(false);
  });
});

describe("validateTwilioWebhook", () => {
  afterEach(() => {
    delete process.env.TWILIO_AUTH_TOKEN;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("fails closed in production without TWILIO_AUTH_TOKEN", () => {
    vi.stubEnv("NODE_ENV", "production");
    const formData = new FormData();
    const request = {
      headers: { get: () => null },
      nextUrl: { pathname: "/api/twilio/voice", search: "" },
    } as unknown as NextRequest;

    expect(validateTwilioWebhook(request, formData)).toBe(false);
  });

  it("rejects missing X-Twilio-Signature when auth token is set", () => {
    process.env.TWILIO_AUTH_TOKEN = "test-auth-token";
    const formData = new FormData();
    const request = {
      headers: { get: () => null },
      nextUrl: { pathname: "/api/twilio/voice", search: "" },
    } as unknown as NextRequest;

    expect(validateTwilioWebhook(request, formData)).toBe(false);
  });
});

describe("escapeXml", () => {
  it("escapes TwiML-sensitive characters", () => {
    expect(escapeXml(`+1<script>alert("x")</script>`)).toBe(
      "+1&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands and apostrophes", () => {
    expect(escapeXml(`O'Brien & Co`)).toBe("O&apos;Brien &amp; Co");
  });
});
