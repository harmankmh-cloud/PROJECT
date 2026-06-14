import type { SupabaseClient, User } from "@supabase/supabase-js";
import { authLog, authMetric } from "@/lib/auth/observability";

const USER_TTL_MS = 5000;

let cachedUser: User | null | undefined;
let cachedAt = 0;
let inflight: Promise<User | null> | null = null;

/** Clear after sign-out or failed verify so the next read hits the network once. */
export function invalidateAuthUserCache() {
  cachedUser = undefined;
  cachedAt = 0;
  inflight = null;
}

/**
 * Client-only getUser with single-flight dedupe + short TTL.
 * Concurrent callers share one /auth/v1/user request; cache avoids bursts on re-render.
 */
export async function getAuthUser(
  supabase: SupabaseClient,
  options?: { force?: boolean }
): Promise<User | null> {
  const now = Date.now();

  if (!options?.force && cachedUser !== undefined && now - cachedAt < USER_TTL_MS) {
    authMetric("getUser.cache_hit");
    return cachedUser;
  }

  if (inflight) {
    authMetric("getUser.deduped");
    return inflight;
  }

  authLog("getUser.start");
  authMetric("getUser.network");

  inflight = supabase.auth
    .getUser()
    .then(({ data, error }) => {
      const user = data.user ?? null;
      cachedUser = user;
      cachedAt = Date.now();
      if (error) authLog("getUser.fail", { message: error.message });
      else authLog("getUser.ok", { userId: user?.id ?? null });
      return user;
    })
    .catch((err: unknown) => {
      authLog("getUser.fail", { message: err instanceof Error ? err.message : String(err) });
      return cachedUser ?? null;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Prefer local session JWT — no network unless session missing. */
export async function getAuthSessionUser(supabase: SupabaseClient): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    cachedUser = data.session.user;
    cachedAt = Date.now();
    return data.session.user;
  }
  return getAuthUser(supabase);
}
