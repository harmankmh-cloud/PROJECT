import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { dialOutbound, encodeClientState, isTelnyxConfigured } from "@/lib/telnyx";
import { getTwilioClient } from "@/lib/twilio";
import { getTelephonyStatus } from "@/lib/telephony-status";

const rateLimit = new Map<string, number[]>();
const MAX_CALLS_PER_HOUR = 3;
const DEMO_MAX_SECONDS = 60;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const hits = (rateLimit.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= MAX_CALLS_PER_HOUR) return true;
  hits.push(now);
  rateLimit.set(ip, hits);
  return false;
}

function toE164(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.DEMO_CALL_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Live demo calls are disabled. Book a demo at /help?intent=demo." },
      { status: 503 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demo call limit reached. Try again in an hour or book a live demo." },
      { status: 429 }
    );
  }

  const telephony = getTelephonyStatus();
  if (!telephony.voiceAvailable) {
    return NextResponse.json({ error: telephony.userMessage }, { status: 503 });
  }

  const demoAgentId =
    process.env.DEMO_AGENT_ID?.trim() ||
    process.env.DEFAULT_AGENT_ID?.trim() ||
    "fb1231c2-1312-4b6d-8ae1-c299ce9b6ae7";

  const body = await request.json();
  const toPhone = (body.phone as string)?.replace(/\D/g, "");
  if (!toPhone || toPhone.length < 10) {
    return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: agent } = await admin
    .from("va_agents")
    .select("id, org_id, welcome_greeting")
    .eq("id", demoAgentId)
    .maybeSingle();

  if (!agent) {
    return NextResponse.json({ error: "Demo agent not found" }, { status: 404 });
  }

  const e164 = toE164(toPhone);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greetq.com";

  try {
    if (telephony.provider === "telnyx" && isTelnyxConfigured()) {
      const from = process.env.TELNYX_PHONE_NUMBER!;
      const connectionId = process.env.TELNYX_CONNECTION_ID!;
      const clientState = encodeClientState({
        orgId: agent.org_id,
        agentId: agent.id,
        sandbox: "true",
      });

      const result = await dialOutbound({
        to: e164,
        from,
        connectionId,
        webhookUrl: `${appUrl}/api/telnyx/webhook`,
        clientState,
      });

      const callControlId = result?.data?.call_control_id as string | undefined;
      if (callControlId) {
        await admin.from("va_calls").insert({
          org_id: agent.org_id,
          agent_id: agent.id,
          twilio_call_sid: callControlId,
          direction: "outbound",
          from_number: from,
          to_number: e164,
          status: "initiated",
          is_sandbox: true,
          handoff_payload: { sandboxMaxSeconds: DEMO_MAX_SECONDS, purpose: "public_demo" },
          started_at: new Date().toISOString(),
        });
      }
    } else {
      const client = getTwilioClient();
      const from = process.env.TWILIO_PHONE_NUMBER!;
      if (!client || !from) {
        return NextResponse.json({ error: telephony.userMessage }, { status: 503 });
      }

      const twilioCall = await client.calls.create({
        to: e164,
        from,
        url: `${appUrl}/api/twilio/sandbox-outbound?org_id=${encodeURIComponent(agent.org_id)}&agent_id=${encodeURIComponent(agent.id)}`,
        statusCallback: `${appUrl}/api/twilio/status`,
        statusCallbackMethod: "POST",
      });

      await admin.from("va_calls").insert({
        org_id: agent.org_id,
        agent_id: agent.id,
        twilio_call_sid: twilioCall.sid,
        direction: "outbound",
        from_number: from,
        to_number: e164,
        status: "initiated",
        is_sandbox: true,
        handoff_payload: { sandboxMaxSeconds: DEMO_MAX_SECONDS, purpose: "public_demo" },
        started_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      message: `Calling ${e164} now — answer to hear GreetQ (1 min max).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Dial failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
