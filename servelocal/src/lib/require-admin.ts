import "server-only";

import { NextResponse } from "next/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";

export async function requirePlatformAdmin() {
  const user = await getServerAuthUser();

  if (!user || !isPlatformAdmin(user.email)) {
    return null;
  }

  return user;
}

export async function requirePlatformAdminApi(): Promise<
  | { ok: true; user: NonNullable<Awaited<ReturnType<typeof requirePlatformAdmin>>> }
  | { ok: false; response: NextResponse }
> {
  const user = await requirePlatformAdmin();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true, user };
}
