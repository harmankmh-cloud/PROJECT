import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertUserProfile } from "@/lib/user-profiles";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  role: z.enum(["homeowner", "pro"]).optional(),
  display_name: z.string().optional(),
  phone: z.string().nullable().optional(),
  notification_email: z.boolean().optional(),
  notification_sms: z.boolean().optional(),
  onboarding_completed_at: z.string().nullable().optional(),
  onboarding_step: z.number().int().optional(),
  preferred_city_slug: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const result = await upsertUserProfile(user.id, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
