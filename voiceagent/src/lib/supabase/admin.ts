import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

const globalForSupabase = globalThis as typeof globalThis & {
  __greetqAdminClient?: SupabaseClient;
};

/** Singleton service-role client — reused across serverless invocations. */
export function createAdminClient(): SupabaseClient {
  if (!globalForSupabase.__greetqAdminClient) {
    globalForSupabase.__greetqAdminClient = createClient(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return globalForSupabase.__greetqAdminClient;
}
