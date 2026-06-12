import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { enableChannel, type ChannelType } from "@/lib/omnichannel";
import { createAdminClient } from "@/lib/supabase/admin";
import { denyUnlessCanOperate } from "@/lib/require-org-access";

const CHANNEL_TYPES: ChannelType[] = ["sms", "whatsapp", "web_chat"];

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ channels: [] });

  const { data } = await supabase
    .from("va_channels")
    .select("channel_type, is_active, config")
    .eq("org_id", org.id);

  const byType = Object.fromEntries(
    (data || []).map((c: { channel_type: string; is_active: boolean; config: unknown }) => [
      c.channel_type,
      { is_active: c.is_active, config: c.config },
    ])
  );

  const channels = CHANNEL_TYPES.map((type) => ({
    channel_type: type,
    is_active: byType[type]?.is_active ?? false,
    config: byType[type]?.config ?? {},
  }));

  return NextResponse.json({ channels });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const body = await request.json();
  const channelType = body.channel_type as ChannelType;

  if (channelType === "web_chat") {
    return NextResponse.json(
      { error: "Web chat widget is coming soon. SMS and WhatsApp are available now." },
      { status: 400 }
    );
  }

  if (!CHANNEL_TYPES.includes(channelType)) {
    return NextResponse.json({ error: "Invalid channel type" }, { status: 400 });
  }

  if (body.is_active) {
    await enableChannel(org.id, channelType, body.config || {});
  } else {
    const admin = createAdminClient();
    await admin
      .from("va_channels")
      .upsert(
        {
          org_id: org.id,
          channel_type: channelType,
          is_active: false,
          config: body.config || {},
        },
        { onConflict: "org_id,channel_type" }
      );
  }

  return NextResponse.json({ ok: true, channel_type: channelType, is_active: Boolean(body.is_active) });
}
