import { createServiceClient } from "@/lib/supabase/admin";

export type UserRole = "homeowner" | "pro";

export type UserProfile = {
  id: string;
  role: UserRole;
  display_name: string | null;
  phone: string | null;
  created_at: string;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const admin = createServiceClient();
  if (!admin) return null;

  const { data, error } = await admin.from("user_profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as UserProfile;
}

export async function upsertUserProfile(
  userId: string,
  fields: Partial<Pick<UserProfile, "role" | "display_name" | "phone">>
) {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Database not configured" };

  const { error } = await admin.from("user_profiles").upsert(
    { id: userId, ...fields },
    { onConflict: "id" }
  );

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
