import { getBrowserClient } from "@/lib/supabase/browser-client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function createClient() {
  return getBrowserClient();
}

export { isSupabaseConfigured };
