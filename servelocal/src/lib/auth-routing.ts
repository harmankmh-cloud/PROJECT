import type { User } from "@supabase/supabase-js";
import { getUserProfile, type UserRole } from "@/lib/user-profiles";

export async function resolveUserRole(user: User): Promise<UserRole | undefined> {
  const profile = await getUserProfile(user.id);
  const metaRole = user.user_metadata?.role as string | undefined;
  if (profile?.role) return profile.role;
  if (metaRole === "pro" || metaRole === "homeowner") return metaRole;
  return undefined;
}

export function isProPath(pathname: string) {
  return pathname.startsWith("/dashboard/pro");
}

export function isHomeownerDashboardPath(pathname: string) {
  return pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/pro");
}
