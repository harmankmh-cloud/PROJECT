import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import { dialOutbound, encodeClientState, isTelnyxConfigured } from "@/lib/telnyx";

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

  if (!isTelnyxConfigured()) {
    return NextResponse.json(
      { error: "Test calls require Telnyx. Set TELNYX_API_KEY and TELNYX_CONNECTION_ID." },
      { status: 400 }
    );
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

  const from = process.env.TELNYX_PHONE_NUMBER;
  const connectionId = process.env.TELNYX_CONNECTION_ID;
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://intellivo.ca"}/api/telnyx/webhook`;

  if (!from || !connectionId) {
    return NextResponse.json(
      { error: "TELNYX_PHONE_NUMBER and TELNYX_CONNECTION_ID must be configured" },
      { status: 400 }
    );
  }

  const e164 = toPhone.startsWith("1") ? `+${toPhone}` : `+1${toPhone}`;

  try {
    const admin = createAdminClient();
    const clientState = encodeClientState({
      orgId: org.id,
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
        org_id: org.id,
        agent_id: agent.id,
        twilio_call_sid: callControlId,
        direction: "outbound",
        from_number: from,
        to_number: e164,
        status: "initiated",
        is_sandbox: true,
        handoff_payload: { sandboxMaxSeconds: 60, purpose: "agent_test" },
        started_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      message: `Test call initiated to ${e164}. Answer your phone to hear your agent (1 min max).`,
      call_control_id: callControlId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Dial failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
