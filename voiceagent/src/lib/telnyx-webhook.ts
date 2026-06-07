import "server-only";
import { createPublicKey, verify } from "crypto";
import type { NextRequest } from "next/server";

/** Validate Telnyx Ed25519 webhook signature. Skips only in dev when key unset. */
export function validateTelnyxWebhook(
  request: NextRequest,
  rawBody: string
): boolean {
  const publicKeyB64 = process.env.TELNYX_PUBLIC_KEY;
  if (!publicKeyB64) {
    return process.env.NODE_ENV !== "production";
  }

  const signature = request.headers.get("telnyx-signature-ed25519");
  const timestamp = request.headers.get("telnyx-timestamp");
  if (!signature || !timestamp) return false;

  const signedPayload = `${timestamp}|${rawBody}`;

  try {
    const key = createPublicKey({
      key: Buffer.from(publicKeyB64, "base64"),
      format: "der",
      type: "spki",
    });

    return verify(
      null,
      Buffer.from(signedPayload),
      key,
      Buffer.from(signature, "base64")
    );
  } catch {
    return false;
  }
}
