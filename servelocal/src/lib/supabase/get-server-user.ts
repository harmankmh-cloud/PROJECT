import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Dedupe getUser within a single RSC request (layout + page share one /auth/v1/user call).
 * Do NOT use in route handlers after verifyOtp/exchangeCode — session must be read fresh there.
 */
export const getServerAuthUser = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});
