import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return value.trim();
}

function getAdmin() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function resolveVoiceContext(to: string) {
  const defaults = {
    orgId: process.env.DEFAULT_ORG_ID || "default",
    agentId: process.env.DEFAULT_AGENT_ID || "default",
    welcomeGreeting: "Hello! Thanks for calling. How can I help you today?",
    systemPrompt:
      "You are a friendly phone assistant for a local business. Help callers with questions, book appointments, and transfer to a human when needed. Keep answers brief.",
    escalationPhone: undefined as string | undefined,
  };

  const admin = getAdmin();
  if (!admin || !to) return defaults;

  const normalized = normalizePhone(to);
  const { data: phoneRecord } = await admin
    .from("va_phone_numbers")
    .select("org_id, agent_id, va_agents(*)")
    .eq("phone_number", normalized)
    .maybeSingle();

  if (!phoneRecord) return defaults;

  let orgId = phoneRecord.org_id || defaults.orgId;
  let agentId = phoneRecord.agent_id || defaults.agentId;
  let welcomeGreeting = defaults.welcomeGreeting;
  let systemPrompt = defaults.systemPrompt;
  let escalationPhone: string | undefined;

  if (phoneRecord.va_agents) {
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
  const admin = getAdmin();
  if (!admin || !params.callSid || params.orgId === "default") return;

  try {
    await admin.from("va_calls").upsert(
      {
        org_id: params.orgId,
        agent_id: params.agentId !== "default" ? params.agentId : null,
        twilio_call_sid: params.callSid,
        direction: "inbound",
        from_number: params.from,
        to_number: normalizePhone(params.to),
        status: "in-progress",
        started_at: new Date().toISOString(),
      },
      { onConflict: "twilio_call_sid" }
    );
  } catch (err) {
    console.error("ensureCallRecord failed:", err);
  }
}

export async function loadCallHistory(callSid: string) {
  const admin = getAdmin();
  if (!admin || !callSid) return [];

  try {
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
  } catch (err) {
    console.error("loadCallHistory failed:", err);
    return [];
  }
}

export async function appendTranscript(callSid: string, role: string, content: string) {
  const admin = getAdmin();
  if (!admin || !callSid) return;

  try {
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
  } catch (err) {
    console.error("appendTranscript failed:", err);
  }
}
