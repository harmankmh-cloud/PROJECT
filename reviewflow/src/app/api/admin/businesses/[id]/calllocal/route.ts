import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { ensureCallLocalSettingsRow } from "@/lib/calllocal-data";

const bodySchema = z.object({
  enabled: z.boolean().optional(),
  twilioPhoneE164: z.string().min(10).max(20).optional().nullable(),
  ringPhoneE164: z.string().min(10).max(20).optional().nullable(),
  smsTemplate: z.string().min(10).max(500).optional(),
  notifyOwnerOnMissed: z.boolean().optional(),
});

function normalizePhone(input: string) {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const { id: businessId } = await params;

  try {
    const body = bodySchema.parse(await request.json());
    const admin = createServiceClient();
    if (!admin) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const { data: business } = await admin
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    await ensureCallLocalSettingsRow(businessId);

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.enabled !== undefined) patch.enabled = body.enabled;
    if (body.twilioPhoneE164 !== undefined) {
      patch.twilio_phone_e164 = body.twilioPhoneE164
        ? normalizePhone(body.twilioPhoneE164)
        : null;
    }
    if (body.ringPhoneE164 !== undefined) {
      patch.ring_phone_e164 = body.ringPhoneE164 ? normalizePhone(body.ringPhoneE164) : null;
    }
    if (body.smsTemplate !== undefined) patch.sms_template = body.smsTemplate.trim();
    if (body.notifyOwnerOnMissed !== undefined) patch.notify_owner_on_missed = body.notifyOwnerOnMissed;

    const { data: updated, error } = await admin
      .from("calllocal_settings")
      .update(patch)
      .eq("business_id", businessId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const { id: businessId } = await params;
  const settings = await ensureCallLocalSettingsRow(businessId);
  return NextResponse.json({ settings });
}
