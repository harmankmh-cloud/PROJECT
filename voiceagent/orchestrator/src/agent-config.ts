import type { AgentConfig } from "./types.js";

export function getAppUrl() {
  return (
    process.env.ORCHESTRATOR_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://127.0.0.1:3002"
  );
}

export async function fetchAgentConfig(orgId: string, agentId: string): Promise<AgentConfig> {
  const apiUrl = getAppUrl();
  const apiKey = process.env.ORCHESTRATOR_API_KEY || "";

  try {
    const res = await fetch(
      `${apiUrl}/api/orchestrator/config?orgId=${orgId}&agentId=${agentId}`,
      { headers: { "x-orchestrator-key": apiKey }, signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) return (await res.json()) as AgentConfig;
    console.warn("Config fetch failed", { status: res.status, orgId, agentId });
  } catch (err) {
    console.warn("Config fetch error:", err);
  }

  return {
    orgId,
    agentId,
    systemPrompt:
      process.env.DEFAULT_SYSTEM_PROMPT ||
      "You are a helpful phone assistant for a local business. Answer questions, book appointments, and transfer to a human when needed.",
    welcomeGreeting: "Hello! How can I help you today?",
    escalationPhone: process.env.DEFAULT_ESCALATION_PHONE,
  };
}
