import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { denyUnlessCanOperate } from "@/lib/require-org-access";

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

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};

  if (body.spending_limit_cents !== undefined) {
    const raw = body.spending_limit_cents;
    if (raw === null || raw === "") {
      updates.spending_limit_cents = null;
      updates.overage_blocked = false;
    } else {
      const cents = Math.max(0, Math.round(Number(raw)));
      updates.spending_limit_cents = cents > 0 ? cents : null;
      if (cents > 0) updates.overage_blocked = false;
    }
  }

  if (body.overage_blocked !== undefined && body.spending_limit_cents === undefined) {
    updates.overage_blocked = Boolean(body.overage_blocked);
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("va_organizations")
    .update(updates)
    .eq("id", org.id)
    .select("spending_limit_cents, overage_blocked")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ settings: data });
}
