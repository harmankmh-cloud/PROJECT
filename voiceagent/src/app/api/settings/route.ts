import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";
import { isApiSession, requireApiSession } from "@/lib/api-session";
import { parseJsonBody, readJsonBody } from "@/lib/parse-json-body";
import { denyUnlessCanManage } from "@/lib/require-org-access";

const businessHoursSchema = z.record(
  z.string(),
  z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  })
);

const settingsPatchSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    transfer_phone: z.string().max(32).nullable().optional(),
    data_region: z.enum(["us", "eu"]).optional(),
    white_label: z
      .object({
        brandName: z.string().max(120).optional(),
        domain: z.string().max(253).optional(),
      })
      .optional(),
    hipaa_enabled: z.boolean().optional(),
    recording_retention_days: z.number().int().min(1).max(3650).optional(),
    business_hours: businessHoursSchema.optional(),
    webhook_url: z.union([z.string().url().max(2048), z.literal("")]).nullable().optional(),
    webhook_secret: z.string().max(256).nullable().optional(),
  })
  .strict();

export async function GET() {
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
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
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanManage(org.id, session.user.id);
  if (denied) return denied;

  const parsed = parseJsonBody(await readJsonBody(request), settingsPatchSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.name !== undefined) updates.name = body.name;
  if (body.transfer_phone !== undefined) updates.transfer_phone = body.transfer_phone || null;
  if (body.data_region !== undefined) updates.data_region = body.data_region;
  if (body.white_label !== undefined) updates.white_label = body.white_label;
  if (body.hipaa_enabled !== undefined) updates.hipaa_enabled = body.hipaa_enabled;
  if (body.recording_retention_days !== undefined) {
    updates.recording_retention_days = body.recording_retention_days;
  }
  if (body.business_hours !== undefined) updates.business_hours = body.business_hours;
  if (body.webhook_url !== undefined) {
    updates.webhook_url = body.webhook_url ? body.webhook_url.trim() : null;
  }
  if (body.webhook_secret !== undefined && body.webhook_secret !== "••••••••") {
    updates.webhook_secret = body.webhook_secret ? body.webhook_secret.trim() : null;
  }

  const { data, error } = await session.supabase
    .from("va_organizations")
    .update(updates)
    .eq("id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: session.user.id,
    action: "settings.updated",
    resourceType: "organization",
    resourceId: org.id,
  });

  return NextResponse.json({ settings: data });
}
