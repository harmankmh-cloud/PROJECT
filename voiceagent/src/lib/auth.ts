import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function requireUser() {
  return getCachedUser();
}

export async function getUserOrg(userId: string) {
  const admin = createAdminClient();
  const { data: owned } = await admin
    .from("va_organizations")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();

  if (owned) return owned;

  const { data: member } = await admin
    .from("va_org_members")
    .select("org_id, va_organizations(*)")
    .eq("user_id", userId)
    .maybeSingle();

  if (member?.va_organizations) {
    const org = member.va_organizations;
    return Array.isArray(org) ? org[0] : org;
  }

  return null;
}

export const getCachedUserOrg = cache(async () => {
  const user = await getCachedUser();
  if (!user) return null;
  const org = await getUserOrg(user.id);
  return { user, org };
});

export async function requireOrg() {
  const ctx = await getCachedUserOrg();
  if (!ctx?.user || !ctx.org) return null;
  return { user: ctx.user, org: ctx.org };
}

export function verifyOrchestratorKey(request: Request): boolean {
  const key = process.env.ORCHESTRATOR_API_KEY;
  if (!key) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-orchestrator-key") === key;
}
