import { createClient } from "@/lib/supabase/client";

/** Refresh session cookies, then hard-navigate so middleware sees the new session. */
export async function redirectAfterAuth(path = "/auth/after-login") {
  try {
    const supabase = createClient();
    await supabase.auth.refreshSession();
  } catch (err) {
    console.warn("[redirectAfterAuth] refreshSession failed, navigating anyway:", err);
  }
  window.location.href = path;
}
