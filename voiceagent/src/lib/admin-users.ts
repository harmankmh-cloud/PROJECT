import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export type PlatformUserRow = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
};

export async function findUserByEmail(email: string): Promise<User | null> {
  const admin = createAdminClient();
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

export async function listPlatformUsers(maxPages = 10): Promise<PlatformUserRow[]> {
  const admin = createAdminClient();
  const rows: PlatformUserRow[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;

    for (const user of data.users) {
      if (!user.email) continue;
      rows.push({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
        email_confirmed: Boolean(user.email_confirmed_at),
      });
    }

    if (data.users.length < 200) break;
  }

  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function invitePlatformUser(
  email: string,
  redirectTo: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalized);
  if (existing) {
    return { ok: false, error: "That email already has an account." };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(normalized, {
    redirectTo,
  });

  if (error || !data.user) {
    return { ok: false, error: error?.message || "Invite failed" };
  }

  return { ok: true, userId: data.user.id };
}
