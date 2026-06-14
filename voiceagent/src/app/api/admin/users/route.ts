import { NextResponse } from "next/server";
import { z } from "zod";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { invitePlatformUser, listPlatformUsers } from "@/lib/admin-users";
import { createAdminClient } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/brand";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isPlatformAdmin(user.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const admin = createAdminClient();
  const users = await listPlatformUsers();
  const { data: memberships } = await admin
    .from("va_org_members")
    .select("user_id, role, org_id")
    .limit(500);

  const orgIds = [...new Set((memberships || []).map((m) => m.org_id))];
  const { data: orgs } = orgIds.length
    ? await admin.from("va_organizations").select("id, name, plan").in("id", orgIds)
    : { data: [] as { id: string; name: string; plan: string | null }[] };

  const orgMap = new Map((orgs || []).map((o) => [o.id, o]));
  const orgByUser = new Map<
    string,
    { orgId: string; name: string; plan: string; role: string }
  >();

  for (const row of memberships || []) {
    const org = orgMap.get(row.org_id);
    if (!row.user_id || !org) continue;
    orgByUser.set(row.user_id, {
      orgId: org.id,
      name: org.name,
      plan: org.plan || "starter",
      role: row.role,
    });
  }

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      organization: orgByUser.get(u.id) || null,
    })),
  });
}

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isPlatformAdmin(user.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  try {
    const body = inviteSchema.parse(await request.json());
    const redirectTo = `${APP_URL}/auth/callback?next=/dashboard/setup`;

    const result = await invitePlatformUser(body.email, redirectTo);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, userId: result.userId, message: "Invite email sent." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    return NextResponse.json({ error: "Invite failed." }, { status: 500 });
  }
}
