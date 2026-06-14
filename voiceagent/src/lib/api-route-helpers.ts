import "server-only";
import { NextResponse } from "next/server";
import { getUserOrg } from "@/lib/auth";
import { isApiSession, requireApiSession } from "@/lib/api-session";

export async function requireOrgSession() {
  const session = await requireApiSession();
  if (!isApiSession(session)) {
    return { ok: false as const, response: session };
  }

  const org = await getUserOrg(session.user.id);
  if (!org) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "No organization" }, { status: 400 }),
    };
  }

  return { ok: true as const, session, org };
}
