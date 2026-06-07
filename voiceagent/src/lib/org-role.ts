import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrgRole = "owner" | "admin" | "operator" | "viewer";

export async function getOrgRole(orgId: string, userId: string): Promise<OrgRole | null> {
  const admin = createAdminClient();

  const { data: org } = await admin
    .from("va_organizations")
    .select("owner_id")
    .eq("id", orgId)
    .maybeSingle();

  if (!org) return null;
  if (org.owner_id === userId) return "owner";

  const { data: member } = await admin
    .from("va_org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .maybeSingle();

  return (member?.role as OrgRole) || null;
}

export function canManageOrg(role: OrgRole | null): boolean {
  return role === "owner" || role === "admin";
}

export function canOperate(role: OrgRole | null): boolean {
  return role === "owner" || role === "admin" || role === "operator";
}
