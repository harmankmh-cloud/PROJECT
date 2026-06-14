import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { loadKnowledgeContext } from "@/lib/knowledge-context";
import { resolveAgentModel } from "@/lib/model-catalog";
import { chatCompletion, hasOpenRouter } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = await request.json();
  const agentId = body.agent_id as string | undefined;
  const messages = (body.messages || []) as Array<{ role: string; content: string }>;

  if (!agentId || !messages.length) {
    return NextResponse.json({ error: "agent_id and messages required" }, { status: 400 });
  }

  const { data: agent } = await supabase
    .from("va_agents")
    .select("*")
    .eq("id", agentId)
    .eq("org_id", org.id)
    .maybeSingle();

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  if (!hasOpenRouter()) {
    return NextResponse.json({
      reply: "Sandbox needs OPENROUTER_API_KEY configured on the server.",
    });
  }

  const knowledge = agent.knowledge_base_enabled
    ? await loadKnowledgeContext(org.id, agent.id, messages[messages.length - 1]?.content || "")
    : "";

  const system = [
    agent.system_prompt,
    knowledge ? `\n\nKnowledge base:\n${knowledge}` : "",
    "\n\nYou are in a text sandbox simulating a phone call. Be concise and conversational.",
  ].join("");

  const reply = await chatCompletion({
    messages: [{ role: "system", content: system }, ...messages],
    temperature: agent.temperature ?? 0.6,
    max_tokens: 300,
    model: resolveAgentModel(agent.llm_model),
  });

  return NextResponse.json({ reply: reply || "No response generated." });
}
