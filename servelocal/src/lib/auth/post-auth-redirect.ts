import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js";

/** Build redirect URL after session is established (profile bootstrap happens in after-login). */
export function buildAfterLoginRedirect(origin: string, next?: string | null) {
  const url = new URL("/auth/after-login", origin);
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    url.searchParams.set("next", next);
  }
  return url.toString();
}

export async function resolvePostAuthRedirect(
  origin: string,
  next?: string | null,
  existingClient?: SupabaseClient
) {
  const supabase = existingClient ?? (await createClient());
  if (!supabase) {
    return `${origin}/login?error=auth_failed`;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isPlatformAdmin(user.email)) {
    return `${origin}/admin`;
  }

  return buildAfterLoginRedirect(origin, next);
}

export function isEmailOtpType(value: string | null): value is EmailOtpType {
  return (
    value === "signup" ||
    value === "invite" ||
    value === "magiclink" ||
    value === "recovery" ||
    value === "email_change" ||
    value === "email"
  );
}
