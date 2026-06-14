import type { User } from "@supabase/supabase-js";
import { parseUserProfile } from "@/lib/schemas/db/user-profile";
import { createUserDbClient } from "@/lib/supabase/user-db";
import type { UserProfile, UserRole } from "@/lib/user-profiles";

/** Profile read via user JWT — RLS enforced. */
export async function getAuthUserProfile(userId: string): Promise<UserProfile | null> {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return null;

  const { data, error } = await ctx.supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return parseUserProfile(data) as UserProfile | null;
}

function roleFromMetadata(user: User): UserRole | undefined {
  const metaRole = user.user_metadata?.role as string | undefined;
  if (metaRole === "pro" || metaRole === "homeowner") return metaRole;
  return undefined;
}

/**
 * Create user_profiles from auth metadata on first login (e.g. after email confirmation).
 * Uses the authenticated client so RLS insert policy applies.
 */
export async function ensureUserProfileFromMetadata(user: User): Promise<UserProfile | null> {
  const existing = await getAuthUserProfile(user.id);
  if (existing) return existing;

  const role = roleFromMetadata(user);
  if (!role) return null;

  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== user.id) return null;

  const displayName =
    (user.user_metadata?.display_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    null;

  const { data, error } = await ctx.supabase
    .from("user_profiles")
    .insert({
      id: user.id,
      role,
      display_name: displayName,
    })
    .select("*")
    .maybeSingle();

  if (error || !data) return null;
  return parseUserProfile(data) as UserProfile | null;
}
