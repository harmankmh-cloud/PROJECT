import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ensureCallLocalSettingsRow } from "@/lib/calllocal-data";

const patchSchema = z.object({
  enabled: z.boolean().optional(),
  ringPhoneE164: z.string().min(10).max(20).optional(),
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

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const settings = await ensureCallLocalSettingsRow(business.id);

  return NextResponse.json({ business, settings });
}

export async function PATCH(request: Request) {
  try {
    const body = patchSchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    await ensureCallLocalSettingsRow(business.id);

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.enabled !== undefined) patch.enabled = body.enabled;
    if (body.ringPhoneE164 !== undefined) patch.ring_phone_e164 = normalizePhone(body.ringPhoneE164);
    if (body.smsTemplate !== undefined) patch.sms_template = body.smsTemplate.trim();
    if (body.notifyOwnerOnMissed !== undefined) patch.notify_owner_on_missed = body.notifyOwnerOnMissed;

    const { data: updated, error } = await supabase
      .from("calllocal_settings")
      .update(patch)
      .eq("business_id", business.id)
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
