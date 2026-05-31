import type { User } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/admin";

export async function findUserByEmail(email: string): Promise<User | null> {
  const admin = createServiceClient();
  if (!admin) return null;

  const normalized = email.trim().toLowerCase();
  let page = 1;

  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;

    const match = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (match) return match;

    if (data.users.length < 200) break;
    page += 1;
  }

  return null;
}

export async function getUserEmailById(userId: string): Promise<string | null> {
  const admin = createServiceClient();
  if (!admin) return null;

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user) return null;
  return data.user.email ?? null;
}
