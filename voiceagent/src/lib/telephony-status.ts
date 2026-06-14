import "server-only";

import { getTwilioClient } from "@/lib/twilio";
import { getTelnyxApiKey } from "@/lib/telnyx";

export type TelephonyStatus = {
  voiceAvailable: boolean;
  provider: "telnyx" | "twilio" | null;
  /** Shown in dashboard when voice is unavailable */
  userMessage: string;
  /** Admin/debug detail — not for end-user UI in production */
  detail?: string;
};

export function getTelephonyStatus(): TelephonyStatus {
  const provider = process.env.TELEPHONY_PROVIDER || "telnyx";
  const telnyxKey = getTelnyxApiKey();
  const telnyxConnection = process.env.TELNYX_CONNECTION_ID?.trim();
  const telnyxFrom = process.env.TELNYX_PHONE_NUMBER?.trim();
  const telnyxReady = Boolean(telnyxKey && telnyxConnection && telnyxFrom);

  const twilioClient = getTwilioClient();
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER?.trim();
  const twilioReady = Boolean(twilioClient && twilioFrom);

  if (provider === "telnyx" && telnyxReady) {
    return { voiceAvailable: true, provider: "telnyx", userMessage: "" };
  }

  if (twilioReady) {
    return { voiceAvailable: true, provider: "twilio", userMessage: "" };
  }

  if (telnyxKey && (!telnyxConnection || !telnyxFrom)) {
    return {
      voiceAvailable: false,
      provider: null,
      userMessage:
        "Voice test calls are temporarily unavailable. Text chat below works — we're finishing telephony setup.",
      detail: "Telnyx is partially configured. Set TELNYX_CONNECTION_ID and TELNYX_PHONE_NUMBER on the server.",
    };
  }

  return {
    voiceAvailable: false,
    provider: null,
    userMessage:
      "Voice test calls aren't available yet. Use the text chat below to try your agent — no phone setup needed.",
    detail:
      "Configure Telnyx (TELNYX_API_KEY, TELNYX_CONNECTION_ID, TELNYX_PHONE_NUMBER) or Twilio (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) on Vercel.",
  };
}
