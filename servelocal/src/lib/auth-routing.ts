import type { User } from "@supabase/supabase-js";
import { ensureUserProfileFromMetadata } from "@/lib/auth/queries";
import { getProvidersForUser } from "@/lib/data";
import { getUserProfile, type UserRole } from "@/lib/user-profiles";
import { createServiceClient } from "@/lib/supabase/admin";

export type { UserRole };

export async function userOwnsProviderListings(userId: string): Promise<boolean> {
  const listings = await getProvidersForUser(userId);
  if (listings.length > 0) return true;

  const admin = createServiceClient();
  if (!admin) return false;

  const { count, error } = await admin
    .from("service_providers")
    .select("id", { count: "exact", head: true })
    .eq("owner_user_id", userId);

  if (error) return false;
  return (count ?? 0) > 0;
}

/** Resolve account type from profile, auth metadata, or owned pro listings. */
export async function resolveUserRole(user: User): Promise<UserRole | undefined> {
  const profile = await getUserProfile(user.id);
  if (profile?.role) return profile.role;

  const metaRole = user.user_metadata?.role as string | undefined;
  if (metaRole === "pro" || metaRole === "homeowner") return metaRole;

  if (await userOwnsProviderListings(user.id)) return "pro";

  return undefined;
}

export function isProPath(pathname: string) {
  return pathname.startsWith("/dashboard/pro") || pathname === "/onboarding";
}

export function isHomeownerDashboardPath(pathname: string) {
  if (pathname.startsWith("/onboarding/homeowner")) return true;
  return pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/pro");
}

export function dashboardPathForRole(role: UserRole | undefined) {
  if (role === "pro") return "/dashboard/pro";
  if (role === "homeowner") return "/dashboard";
  return "/signup";
}

function safeNextPath(next: string | null | undefined, role: UserRole) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  if (role === "pro" && isHomeownerDashboardPath(next)) return null;
  if (role === "homeowner" && isProPath(next)) return null;
  return next;
}

/** Where to send the user immediately after password/OAuth login. */
export async function resolvePostLoginPath(
  user: User,
  options?: { next?: string | null }
): Promise<string> {
  let profile = await getUserProfile(user.id);
  if (!profile) {
    profile = await ensureUserProfileFromMetadata(user);
  }

  let role = profile?.role ?? (await resolveUserRole(user));

  if (!role) {
    return "/signup?notice=choose_account_type";
  }

  const next = safeNextPath(options?.next ?? null, role);

  if (role === "pro") {
    const listings = await getProvidersForUser(user.id);
    if (listings.length === 0) {
      return next && next.startsWith("/onboarding") ? next : "/onboarding";
    }
    return next ?? "/dashboard/pro";
  }

  if (!profile?.onboarding_completed_at) {
    return next ?? "/onboarding/homeowner";
  }

  return next ?? "/dashboard";
}
