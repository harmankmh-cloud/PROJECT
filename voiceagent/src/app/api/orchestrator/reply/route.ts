import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { verifyOrchestratorKey } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { appendTranscript, loadCallHistory } from "@/lib/twilio-voice-context";
import { loadKnowledgeContext } from "@/lib/knowledge-context";
import { processVoiceTurn } from "@/lib/voice-flow-runtime";

export async function POST(request: NextRequest) {
  if (!verifyOrchestratorKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const callSid = String(body.callSid || "");
  const orgId = String(body.orgId || "");
  const agentId = String(body.agentId || "");
  const userMessage = String(body.userMessage || "").trim();

  if (!callSid || !orgId || !agentId || !userMessage) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const admin = createAdminClient();

  const [{ data: agent }, { data: org }, history] = await Promise.all([
    admin.from("va_agents").select("*").eq("id", agentId).eq("org_id", orgId).maybeSingle(),
    admin.from("va_organizations").select("transfer_phone").eq("id", orgId).maybeSingle(),
    loadCallHistory(callSid),
  ]);

  const knowledgeContext =
    agent?.knowledge_base_enabled
      ? await loadKnowledgeContext(orgId, agentId, userMessage)
      : "";

  const { data: callRow } = await admin
    .from("va_calls")
    .select("from_number")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  const reply = await processVoiceTurn({
    callSid,
    orgId,
    agentId,
    userMessage,
    systemPrompt: agent?.system_prompt || "You are a helpful phone assistant.",
    knowledgeContext: knowledgeContext || undefined,
    escalationPhone: agent?.escalation_phone || org?.transfer_phone || undefined,
    callerPhone: callRow?.from_number || undefined,
    history,
  });

  after(async () => {
    await appendTranscript(callSid, "user", userMessage);
    await appendTranscript(callSid, "assistant", reply.text);
  });

  return NextResponse.json(reply);
}
