import type { User } from "@supabase/supabase-js";

/** Client-safe path to the post-auth router (preserves pro/homeowner intent). */
export function afterLoginPath(user?: User | null, next?: string | null) {
  const params = new URLSearchParams();
  const role = user?.user_metadata?.role;
  if (role === "pro" || role === "homeowner") {
    params.set("as", role);
  }
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    params.set("next", next);
  }
  const qs = params.toString();
  return qs ? `/auth/after-login?${qs}` : "/auth/after-login";
}
