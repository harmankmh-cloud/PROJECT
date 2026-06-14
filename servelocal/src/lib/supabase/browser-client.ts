import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

/** Single browser Supabase client — avoids duplicate auth listeners and token refresh. */
export function getBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Missing Supabase env vars. Copy .env.local.template to .env.local");
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}
