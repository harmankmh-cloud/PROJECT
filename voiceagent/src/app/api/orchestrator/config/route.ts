import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyOrchestratorKey } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!verifyOrchestratorKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = request.nextUrl.searchParams.get("orgId");
  const agentId = request.nextUrl.searchParams.get("agentId");

  if (!orgId || !agentId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: agent } = await admin
    .from("va_agents")
    .select("*")
    .eq("id", agentId)
    .eq("org_id", orgId)
    .maybeSingle();

  const { data: org } = await admin
    .from("va_organizations")
    .select("transfer_phone")
    .eq("id", orgId)
    .maybeSingle();

  let knowledgeContext = "";
  if (agent?.knowledge_base_enabled) {
    const { data: docs } = await admin
      .from("va_knowledge_docs")
      .select("title, content")
      .eq("org_id", orgId)
      .limit(10);

    if (docs?.length) {
      knowledgeContext = docs.map((d) => `## ${d.title}\n${d.content}`).join("\n\n");
    }
  }

  return NextResponse.json({
    orgId,
    agentId,
    systemPrompt: agent?.system_prompt || "You are a helpful phone assistant.",
    welcomeGreeting: agent?.welcome_greeting || "Hello! How can I help you today?",
    escalationPhone: agent?.escalation_phone || org?.transfer_phone || undefined,
    knowledgeContext: knowledgeContext || undefined,
  });
}
