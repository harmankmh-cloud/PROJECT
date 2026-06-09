import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { dialOutbound, encodeClientState, isTelnyxConfigured } from "@/lib/telnyx";

const rateLimit = new Map<string, number[]>();
const MAX_CALLS_PER_HOUR = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const hits = (rateLimit.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= MAX_CALLS_PER_HOUR) return true;
  hits.push(now);
  rateLimit.set(ip, hits);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demo call limit reached. Try again in an hour or book a live demo." },
      { status: 429 }
    );
  }

  if (!isTelnyxConfigured()) {
    return NextResponse.json(
      { error: "Live demo calls are not available right now. Book a demo instead." },
      { status: 503 }
    );
  }

  const demoAgentId = process.env.DEMO_AGENT_ID;
  if (!demoAgentId) {
    return NextResponse.json(
      { error: "Demo agent not configured. Book a live demo at /help?intent=demo." },
      { status: 503 }
    );
  }

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

  const from = process.env.TELNYX_PHONE_NUMBER;
  const connectionId = process.env.TELNYX_CONNECTION_ID;
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://greetq.com"}/api/telnyx/webhook`;

  if (!from || !connectionId) {
    return NextResponse.json({ error: "Telephony not configured" }, { status: 503 });
  }

  const e164 = toPhone.startsWith("1") ? `+${toPhone}` : `+1${toPhone}`;

  try {
    const clientState = encodeClientState({
      orgId: agent.org_id,
      agentId: agent.id,
      sandbox: "true",
    });

    const result = await dialOutbound({
      to: e164,
      from,
      connectionId,
      webhookUrl,
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
        handoff_payload: { sandboxMaxSeconds: 60, purpose: "public_demo" },
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
