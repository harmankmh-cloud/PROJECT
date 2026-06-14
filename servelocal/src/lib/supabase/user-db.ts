import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type UserDbContext = {
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  user: User;
};

/** Authenticated Supabase client — RLS applies. Use for user-scoped reads/writes. */
export async function createUserDbClient(): Promise<UserDbContext | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { supabase, user };
}
