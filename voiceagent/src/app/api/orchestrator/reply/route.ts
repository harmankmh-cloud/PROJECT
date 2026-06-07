import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { verifyOrchestratorKey } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { appendTranscript, loadCallHistory } from "@/lib/twilio-voice-context";
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

  let knowledgeContext = "";
  if (agent?.knowledge_base_enabled) {
    const { data: docs } = await admin
      .from("va_knowledge_docs")
      .select("title, content")
      .eq("org_id", orgId)
      .limit(10);

    if (docs?.length) {
      knowledgeContext = docs
        .slice(0, 3)
        .map((d) => `## ${d.title}\n${String(d.content).slice(0, 400)}`)
        .join("\n\n")
        .slice(0, 1500);
    }
  }

  const reply = await processVoiceTurn({
    callSid,
    orgId,
    agentId,
    userMessage,
    systemPrompt: agent?.system_prompt || "You are a helpful phone assistant.",
    knowledgeContext: knowledgeContext || undefined,
    escalationPhone: agent?.escalation_phone || org?.transfer_phone || undefined,
    history,
  });

  after(async () => {
    await appendTranscript(callSid, "user", userMessage);
    await appendTranscript(callSid, "assistant", reply.text);
  });

  return NextResponse.json(reply);
}
