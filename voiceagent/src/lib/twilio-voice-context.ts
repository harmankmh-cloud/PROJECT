import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function resolveVoiceContext(to: string) {
  const admin = createAdminClient();
  const { data: phoneRecord } = await admin
    .from("va_phone_numbers")
    .select("org_id, agent_id, va_agents(*)")
    .eq("phone_number", to)
    .maybeSingle();

  let orgId = phoneRecord?.org_id || process.env.DEFAULT_ORG_ID || "default";
  let agentId = phoneRecord?.agent_id || process.env.DEFAULT_AGENT_ID || "default";
  let welcomeGreeting = "Hello! Thanks for calling. How can I help you today?";
  let systemPrompt =
    "You are a friendly phone assistant for a local business. Help callers with questions, book appointments, and transfer to a human when needed. Keep answers brief.";
  let escalationPhone: string | undefined;

  if (phoneRecord?.va_agents) {
    const agent = Array.isArray(phoneRecord.va_agents)
      ? phoneRecord.va_agents[0]
      : phoneRecord.va_agents;
    if (agent) {
      welcomeGreeting = agent.welcome_greeting;
      systemPrompt = agent.system_prompt;
      agentId = agent.id;
      escalationPhone = agent.escalation_phone || undefined;
    }
  }

  return { orgId, agentId, welcomeGreeting, systemPrompt, escalationPhone };
}

export async function ensureCallRecord(params: {
  callSid: string;
  orgId: string;
  agentId: string;
  from: string;
  to: string;
}) {
  if (!params.callSid || params.orgId === "default") return;

  const admin = createAdminClient();
  await admin.from("va_calls").upsert(
    {
      org_id: params.orgId,
      agent_id: params.agentId !== "default" ? params.agentId : null,
      twilio_call_sid: params.callSid,
      direction: "inbound",
      from_number: params.from,
      to_number: params.to,
      status: "in-progress",
      started_at: new Date().toISOString(),
    },
    { onConflict: "twilio_call_sid" }
  );
}

export async function loadCallHistory(callSid: string) {
  const admin = createAdminClient();
  const { data: call } = await admin
    .from("va_calls")
    .select("id")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (!call) return [];

  const { data: rows } = await admin
    .from("va_call_transcripts")
    .select("role, content")
    .eq("call_id", call.id)
    .order("created_at", { ascending: true });

  return rows || [];
}

export async function appendTranscript(callSid: string, role: string, content: string) {
  const admin = createAdminClient();
  const { data: call } = await admin
    .from("va_calls")
    .select("id")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (!call) return;

  await admin.from("va_call_transcripts").insert({
    call_id: call.id,
    role,
    content,
  });
}
