import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { FlowEngine } from "@/lib/flow-engine";
import type { FlowEdge, FlowNode } from "@/lib/types";
import { generateVoiceReply } from "@/lib/voice-conversation";

export interface FlowState {
  flowId: string;
  currentNodeId: string;
  variables: Record<string, string>;
}

interface PublishedFlow {
  id: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

function getAdmin() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function loadPublishedFlow(orgId: string, agentId: string): Promise<PublishedFlow | null> {
  const admin = getAdmin();
  if (!admin || orgId === "default" || agentId === "default") return null;

  const { data } = await admin
    .from("va_flows")
    .select("id, nodes, edges")
    .eq("org_id", orgId)
    .eq("agent_id", agentId)
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.nodes?.length) return null;

  return {
    id: data.id,
    nodes: data.nodes as FlowNode[],
    edges: (data.edges || []) as FlowEdge[],
  };
}

export async function getFlowWelcomeGreeting(orgId: string, agentId: string, fallback: string) {
  const flow = await loadPublishedFlow(orgId, agentId);
  if (!flow) return fallback;

  const engine = new FlowEngine(flow.nodes, flow.edges);
  const greet = engine.getStartNode();
  if (greet?.type === "greet" && greet.config.message) {
    return String(greet.config.message);
  }
  return fallback;
}

export async function loadFlowState(callSid: string): Promise<FlowState | null> {
  const admin = getAdmin();
  if (!admin || !callSid) return null;

  const { data: call } = await admin
    .from("va_calls")
    .select("handoff_payload")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  const payload = call?.handoff_payload as { flowState?: FlowState } | null;
  return payload?.flowState || null;
}

export async function saveFlowState(callSid: string, state: FlowState | null) {
  const admin = getAdmin();
  if (!admin || !callSid) return;

  const { data: call } = await admin
    .from("va_calls")
    .select("handoff_payload")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  const existing = (call?.handoff_payload as Record<string, unknown>) || {};
  const handoff_payload = state ? { ...existing, flowState: state } : { ...existing, flowState: undefined };

  await admin
    .from("va_calls")
    .update({ handoff_payload })
    .eq("twilio_call_sid", callSid);
}

function initialFlowState(flow: PublishedFlow): FlowState {
  const engine = new FlowEngine(flow.nodes, flow.edges);
  const start = engine.getStartNode();
  let currentNodeId = start?.id || flow.nodes[0]?.id;

  if (start?.type === "greet") {
    const next = engine.getNextNodeId(start.id);
    if (next) currentNodeId = next;
  }

  return { flowId: flow.id, currentNodeId, variables: {} };
}

function runUntilResponse(
  engine: FlowEngine,
  startNodeId: string,
  variables: Record<string, string>,
  userMessage: string
) {
  let nodeId = startNodeId;
  let guard = 0;

  while (guard++ < 12) {
    const result = engine.execute(nodeId, { variables, transcript: [] }, userMessage);

    if (result.action === "transfer" || result.action === "end" || result.action === "tool") {
      return { result, nodeId, variables };
    }

    if (result.response) {
      return {
        result,
        nodeId: result.nextNodeId || nodeId,
        variables,
      };
    }

    if (result.nextNodeId) {
      nodeId = result.nextNodeId;
      userMessage = "";
      continue;
    }

    break;
  }

  return {
    result: { response: "How can I help you next?" },
    nodeId: startNodeId,
    variables,
  };
}

export async function processVoiceTurn(params: {
  callSid: string;
  orgId: string;
  agentId: string;
  userMessage: string;
  systemPrompt: string;
  knowledgeContext?: string;
  escalationPhone?: string;
  history: Array<{ role: string; content: string }>;
}): Promise<{ text: string; shouldTransfer: boolean; transferSummary?: string }> {
  const flow = await loadPublishedFlow(params.orgId, params.agentId);
  if (!flow) {
    return generateVoiceReply({
      systemPrompt: params.systemPrompt,
      knowledgeContext: params.knowledgeContext,
      history: params.history,
      userMessage: params.userMessage,
    });
  }

  const engine = new FlowEngine(flow.nodes, flow.edges);
  let state = await loadFlowState(params.callSid);
  if (!state || state.flowId !== flow.id) {
    state = initialFlowState(flow);
  }

  const { result, nodeId, variables } = runUntilResponse(
    engine,
    state.currentNodeId,
    { ...state.variables },
    params.userMessage
  );

  if (result.action === "transfer") {
    await saveFlowState(params.callSid, { ...state, currentNodeId: nodeId, variables });
    return {
      text: result.response || "Connecting you now.",
      shouldTransfer: true,
      transferSummary: `Flow transfer: ${params.userMessage}`,
    };
  }

  if (result.action === "end") {
    await saveFlowState(params.callSid, null);
    return {
      text: result.response || "Thank you for calling. Goodbye!",
      shouldTransfer: false,
    };
  }

  if (result.action === "tool") {
    const llmReply = await generateVoiceReply({
      systemPrompt: params.systemPrompt,
      knowledgeContext: params.knowledgeContext,
      history: params.history,
      userMessage: params.userMessage,
    });

    const nextId = result.nextNodeId || engine.getNextNodeId(nodeId) || nodeId;
    await saveFlowState(params.callSid, {
      flowId: flow.id,
      currentNodeId: nextId,
      variables,
    });

    return llmReply;
  }

  const nextId = result.nextNodeId || nodeId;
  await saveFlowState(params.callSid, {
    flowId: flow.id,
    currentNodeId: nextId,
    variables,
  });

  return {
    text: result.response || "What else can I help with?",
    shouldTransfer: false,
  };
}
