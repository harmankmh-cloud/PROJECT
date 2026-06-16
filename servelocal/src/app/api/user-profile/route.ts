import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserProfile, upsertUserProfile } from "@/lib/user-profiles";
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

  const existing = await getUserProfile(user.id);
  const fields = { ...parsed.data };
  const newRole = fields.role;

  if (!existing?.role && fields.role) {
    // First-time role assignment (legacy accounts, choose-role flow).
  } else if (existing?.role && fields.role && fields.role !== existing.role) {
    return NextResponse.json({ error: "Role cannot be changed after signup" }, { status: 403 });
  }

  if (existing?.role) {
    delete fields.role;
  }

  const result = await upsertUserProfile(user.id, fields);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const effectiveRole = existing?.role ?? newRole;
  if (effectiveRole && user.user_metadata?.role !== effectiveRole) {
    await supabase.auth.updateUser({
      data: {
        role: effectiveRole,
        display_name:
          (user.user_metadata?.display_name as string | undefined)?.trim() ||
          user.email?.split("@")[0] ||
          undefined,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
