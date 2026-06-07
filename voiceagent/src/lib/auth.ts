import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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

export async function requireOrg() {
  const user = await requireUser();
  if (!user) return null;

  const org = await getUserOrg(user.id);
  return org ? { user, org } : null;
}

export function verifyOrchestratorKey(request: Request): boolean {
  const key = process.env.ORCHESTRATOR_API_KEY;
  if (!key) {
    // In production, internal orchestrator routes must be keyed.
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-orchestrator-key") === key;
}
