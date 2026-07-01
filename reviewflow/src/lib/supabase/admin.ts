import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Hard guard: the service-role client bypasses RLS and must NEVER run in the
// browser. If this module is ever bundled into client code and evaluated, fail
// loudly at import time rather than silently shipping an admin key to users.
if (typeof window !== "undefined") {
  throw new Error(
    "supabase/admin.ts (service-role client) was imported in the browser. " +
      "This module is server-only and must only be used in API routes, " +
      "server actions, or server components.",
  );
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
