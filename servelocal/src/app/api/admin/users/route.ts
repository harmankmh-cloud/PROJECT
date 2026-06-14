import { NextResponse } from "next/server";
import { z } from "zod";
import { invitePlatformUser, listPlatformUsers } from "@/lib/admin-users";
import { requirePlatformAdminApi } from "@/lib/require-admin";
import { createServiceClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }

  const users = await listPlatformUsers();
  const { data: providers } = await admin
    .from("service_providers")
    .select("id, owner_user_id, business_name, status, listing_tier")
    .not("owner_user_id", "is", null);

  const providerByUser = new Map(
    (providers || [])
      .filter((p) => p.owner_user_id)
      .map((p) => [
        p.owner_user_id as string,
        { id: p.id, name: p.business_name, status: p.status, tier: p.listing_tier },
      ])
  );

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      listing: providerByUser.get(u.id) || null,
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
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.servelocal.ca").replace(/\/$/, "");
    const redirectTo = `${appUrl}/auth/confirm`;

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
