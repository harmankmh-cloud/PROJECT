import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildConversationRelayTwiml } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const to = String(formData.get("To") || "");
  const callSid = String(formData.get("CallSid") || "");
  const from = String(formData.get("From") || "");

  const admin = createAdminClient();

  const { data: phoneRecord } = await admin
    .from("va_phone_numbers")
    .select("org_id, agent_id, va_agents(*)")
    .eq("phone_number", to)
    .maybeSingle();

  let orgId = phoneRecord?.org_id;
  let agentId = phoneRecord?.agent_id;
  let welcomeGreeting = "Hello! How can I help you today?";

  if (phoneRecord?.va_agents) {
    const agent = Array.isArray(phoneRecord.va_agents)
      ? phoneRecord.va_agents[0]
      : phoneRecord.va_agents;
    if (agent) {
      welcomeGreeting = agent.welcome_greeting;
      agentId = agent.id;
    }
  }

  if (!orgId || !agentId) {
    orgId = process.env.DEFAULT_ORG_ID || "default";
    agentId = process.env.DEFAULT_AGENT_ID || "default";
  }

  if (callSid && orgId !== "default") {
    await admin.from("va_calls").upsert(
      {
        org_id: orgId,
        agent_id: agentId !== "default" ? agentId : null,
        twilio_call_sid: callSid,
        direction: "inbound",
        from_number: from,
        to_number: to,
        status: "in-progress",
        started_at: new Date().toISOString(),
      },
      { onConflict: "twilio_call_sid" }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const twiml = buildConversationRelayTwiml({
    orgId,
    agentId,
    welcomeGreeting,
    actionUrl: `${appUrl}/api/twilio/status`,
  });

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
