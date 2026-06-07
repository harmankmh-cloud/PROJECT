import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";
import { denyUnlessCanManage } from "@/lib/require-org-access";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  return NextResponse.json({
    settings: {
      name: org.name,
      transfer_phone: org.transfer_phone || "",
      data_region: org.data_region || "us",
      white_label: org.white_label || {},
      hipaa_enabled: org.hipaa_enabled ?? false,
      recording_retention_days: org.recording_retention_days ?? 30,
      business_hours: org.business_hours || {},
      webhook_url: org.webhook_url || "",
      webhook_secret: org.webhook_secret ? "••••••••" : "",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanManage(org.id, user.id);
  if (denied) return denied;

  const body = await request.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.name !== undefined) updates.name = String(body.name).trim() || org.name;
  if (body.transfer_phone !== undefined) updates.transfer_phone = body.transfer_phone || null;
  if (body.data_region === "us" || body.data_region === "eu") updates.data_region = body.data_region;
  if (body.white_label !== undefined) updates.white_label = body.white_label;
  if (body.hipaa_enabled !== undefined) updates.hipaa_enabled = Boolean(body.hipaa_enabled);
  if (body.recording_retention_days !== undefined) {
    updates.recording_retention_days = Math.max(1, Number(body.recording_retention_days) || 30);
  }
  if (body.business_hours !== undefined) updates.business_hours = body.business_hours;
  if (body.webhook_url !== undefined) {
    updates.webhook_url = body.webhook_url ? String(body.webhook_url).trim() : null;
  }
  if (body.webhook_secret !== undefined && body.webhook_secret !== "••••••••") {
    updates.webhook_secret = body.webhook_secret ? String(body.webhook_secret).trim() : null;
  }

  const { data, error } = await supabase
    .from("va_organizations")
    .update(updates)
    .eq("id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "settings.updated",
    resourceType: "organization",
    resourceId: org.id,
  });

  return NextResponse.json({ settings: data });
}
