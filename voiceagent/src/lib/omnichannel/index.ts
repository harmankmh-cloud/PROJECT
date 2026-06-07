import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

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

export async function routeOmnichannelMessage(params: {
  orgId: string;
  channel: ChannelType;
  from: string;
  body: string;
}) {
  const channels = await getActiveChannels(params.orgId);
  const channel = channels.find((c) => c.channel_type === params.channel);
  if (!channel) return { ok: false, error: "Channel not enabled" };

  return {
    ok: true,
    routed: true,
    channel: params.channel,
    response:
      "Omnichannel routing is configured. Connect your Twilio Messaging Service webhook to /api/omnichannel/inbound for live SMS/WhatsApp.",
  };
}
