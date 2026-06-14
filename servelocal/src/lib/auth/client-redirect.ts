import { createClient } from "@/lib/supabase/client";

/** Refresh session cookies, then hard-navigate so middleware sees the new session. */
export async function redirectAfterAuth(path = "/auth/after-login") {
  const supabase = createClient();
  await supabase.auth.refreshSession();
  window.location.href = path;
}
