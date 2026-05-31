import type { SupabaseClient } from "@supabase/supabase-js";
import { businessSetupFromMetadata, createBusinessForUser } from "@/lib/business-setup";

export async function completePendingBusinessFromMetadata(
  supabase: SupabaseClient
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const setup = businessSetupFromMetadata(user.user_metadata);
  if (!setup) return;

  await createBusinessForUser(supabase, user.id, setup);
}
