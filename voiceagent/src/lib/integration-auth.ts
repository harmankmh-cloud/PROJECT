import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";

/** Ensure OAuth callback state matches the signed-in user's organization. */
export async function verifyIntegrationOrgAccess(orgId: string | null) {
  if (!orgId) return { ok: false as const, reason: "missing_params" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, reason: "unauthorized" };

  const org = await getUserOrg(user.id);
  if (!org || org.id !== orgId) return { ok: false as const, reason: "forbidden" };

  return { ok: true as const, user, org };
}
