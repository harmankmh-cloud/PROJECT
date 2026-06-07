import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadKnowledgeContext } from "@/lib/knowledge-context";
import { generateTextReply } from "@/lib/text-conversation";

export type ChannelType = "sms" | "whatsapp" | "web_chat";

export async function getActiveChannels(orgId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("va_channels")
    .select("*")
    .eq("org_id", orgId)
    .eq("is_active", true);

  return data || [];
}

export async function enableChannel(
  orgId: string,
  channelType: ChannelType,
  config: Record<string, unknown>
) {
  const admin = createAdminClient();
  await admin.from("va_channels").upsert(
    {
      org_id: orgId,
      channel_type: channelType,
      config,
      is_active: true,
    },
    { onConflict: "org_id,channel_type" }
  );
}

async function loadMessagingAgent(orgId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("va_agents")
    .select("id, system_prompt, knowledge_base_enabled")
    .eq("org_id", orgId)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data;
}

export async function routeOmnichannelMessage(params: {
  orgId: string;
  channel: ChannelType;
  from: string;
  body: string;
}) {
  const channels = await getActiveChannels(params.orgId);
  const channel = channels.find((c) => c.channel_type === params.channel);
  if (!channel) return { ok: false, error: "Channel not enabled" };

  const agent = await loadMessagingAgent(params.orgId);
  const systemPrompt =
    agent?.system_prompt ||
    "You are a helpful assistant for a local business answering SMS and WhatsApp messages.";

  let knowledgeContext: string | undefined;
  if (agent?.knowledge_base_enabled) {
    knowledgeContext =
      (await loadKnowledgeContext(params.orgId, agent.id, params.body)) || undefined;
  }

  const response = await generateTextReply({
    systemPrompt,
    knowledgeContext,
    userMessage: params.body,
    channel: params.channel,
  });

  return {
    ok: true,
    routed: true,
    channel: params.channel,
    response,
  };
}
