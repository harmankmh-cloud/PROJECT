import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import { dialOutbound, encodeClientState } from "@/lib/telnyx";
import { getTwilioClient } from "@/lib/twilio";
import { getTelephonyStatus } from "@/lib/telephony-status";
import { canMakeSandboxTestCall, sandboxBlockReason, SANDBOX_MAX_SECONDS } from "@/lib/trial";

function toE164(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const telephony = getTelephonyStatus();
  if (!telephony.voiceAvailable) {
    return NextResponse.json({ error: telephony.userMessage }, { status: 503 });
  }

  const body = await request.json();
  const agentId = body.agent_id as string;
  const toPhone = (body.phone as string)?.replace(/\D/g, "");

  if (!agentId || !toPhone || toPhone.length < 10) {
    return NextResponse.json({ error: "agent_id and valid phone required" }, { status: 400 });
  }

  const { data: agent } = await supabase
    .from("va_agents")
    .select("id, welcome_greeting")
    .eq("id", agentId)
    .eq("org_id", org.id)
    .maybeSingle();

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  if (!canMakeSandboxTestCall(org)) {
    return NextResponse.json({ error: sandboxBlockReason(org) }, { status: 402 });
  }

  const e164 = toE164(toPhone);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greetq.com";
  const admin = createAdminClient();

  try {
    if (telephony.provider === "telnyx") {
      const from = process.env.TELNYX_PHONE_NUMBER!;
      const connectionId = process.env.TELNYX_CONNECTION_ID!;
      const clientState = encodeClientState({
        orgId: org.id,
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
          org_id: org.id,
          agent_id: agent.id,
          twilio_call_sid: callControlId,
          direction: "outbound",
          from_number: from,
          to_number: e164,
          status: "initiated",
          is_sandbox: true,
          handoff_payload: { sandboxMaxSeconds: SANDBOX_MAX_SECONDS, purpose: "agent_test" },
          started_at: new Date().toISOString(),
        });
      }
    } else {
      const client = getTwilioClient();
      const from = process.env.TWILIO_PHONE_NUMBER!;
      if (!client) {
        return NextResponse.json({ error: telephony.userMessage }, { status: 503 });
      }

      const twilioCall = await client.calls.create({
        to: e164,
        from,
        url: `${appUrl}/api/twilio/sandbox-outbound?org_id=${encodeURIComponent(org.id)}&agent_id=${encodeURIComponent(agent.id)}`,
        statusCallback: `${appUrl}/api/twilio/status`,
        statusCallbackMethod: "POST",
      });

      await admin.from("va_calls").insert({
        org_id: org.id,
        agent_id: agent.id,
        twilio_call_sid: twilioCall.sid,
        direction: "outbound",
        from_number: from,
        to_number: e164,
        status: "initiated",
        is_sandbox: true,
        handoff_payload: { sandboxMaxSeconds: SANDBOX_MAX_SECONDS, purpose: "agent_test" },
        started_at: new Date().toISOString(),
      });
    }

    await admin
      .from("va_organizations")
      .update({
        sandbox_test_calls_used: Number(org.sandbox_test_calls_used ?? 0) + 1,
      })
      .eq("id", org.id);

    return NextResponse.json({
      ok: true,
      message: `Test call initiated to ${e164}. Answer your phone to hear your agent (1 min max).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Dial failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
