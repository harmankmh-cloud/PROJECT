import { createUserDbClient } from "@/lib/supabase/user-db";

/** Returns true if the user is a participant in the message thread (RLS-aligned check). */
export async function isThreadParticipant(userId: string, threadId: string) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return false;

  const { data: thread, error } = await ctx.supabase
    .from("message_threads")
    .select("id, homeowner_user_id, provider_id")
    .eq("id", threadId)
    .maybeSingle();

  if (error || !thread) return false;
  if (thread.homeowner_user_id === userId) return true;

  const { data: listing } = await ctx.supabase
    .from("service_providers")
    .select("id")
    .eq("id", thread.provider_id)
    .eq("owner_user_id", userId)
    .maybeSingle();

  return Boolean(listing);
}
