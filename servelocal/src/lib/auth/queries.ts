import type { User } from "@supabase/supabase-js";
import { parseUserProfile } from "@/lib/schemas/db/user-profile";
import { createServiceClient } from "@/lib/supabase/admin";
import { createUserDbClient } from "@/lib/supabase/user-db";
import { getUserProfile, type UserProfile, type UserRole } from "@/lib/user-profiles";

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

async function userOwnsProviderListings(userId: string): Promise<boolean> {
  const ctx = await createUserDbClient();
  if (ctx && ctx.user.id === userId) {
    const { count } = await ctx.supabase
      .from("service_providers")
      .select("id", { count: "exact", head: true })
      .eq("owner_user_id", userId);
    if ((count ?? 0) > 0) return true;
  }

  const admin = createServiceClient();
  if (!admin) return false;

  const { count, error } = await admin
    .from("service_providers")
    .select("id", { count: "exact", head: true })
    .eq("owner_user_id", userId);

  return !error && (count ?? 0) > 0;
}

/**
 * Create user_profiles from auth metadata on first login (e.g. after email confirmation).
 * Uses the authenticated client so RLS insert policy applies.
 */
export async function ensureUserProfileFromMetadata(user: User): Promise<UserProfile | null> {
  const existing = await getAuthUserProfile(user.id);
  if (existing) return existing;

  const existingAdmin = await getUserProfile(user.id);
  if (existingAdmin) return existingAdmin;

  let role = roleFromMetadata(user);
  if (!role && (await userOwnsProviderListings(user.id))) {
    role = "pro";
  }
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

  if (!error && data) {
    return parseUserProfile(data) as UserProfile | null;
  }

  // RLS insert can fail if policies were not applied — bootstrap via service role.
  const admin = createServiceClient();
  if (!admin) return null;

  const { data: upserted, error: upsertError } = await admin
    .from("user_profiles")
    .upsert({ id: user.id, role, display_name: displayName }, { onConflict: "id" })
    .select("*")
    .maybeSingle();

  if (upsertError || !upserted) {
    console.error("[ensureUserProfileFromMetadata] upsert failed:", upsertError?.message ?? error?.message);
    return null;
  }

  return parseUserProfile(upserted) as UserProfile | null;
}
