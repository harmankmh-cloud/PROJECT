import { NextResponse } from "next/server";
import { z } from "zod";
import { invitePlatformUser, listPlatformUsers } from "@/lib/admin-users";
import { getAppUrl } from "@/lib/app-url-server";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";
import { createServiceClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }

  const users = await listPlatformUsers();
  const { data: businesses } = await admin.from("businesses").select("id, user_id, name, slug, plan");

  const businessByUser = new Map(
    (businesses || []).map((b) => [b.user_id, { id: b.id, name: b.name, slug: b.slug, plan: b.plan }])
  );

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      business: businessByUser.get(u.id) || null,
    })),
  });
}

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = inviteSchema.parse(await request.json());
    const appUrl = await getAppUrl();
    const redirectTo = `${appUrl}/auth/callback?next=/dashboard`;

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
