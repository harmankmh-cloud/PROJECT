import { createDbClient, createServiceClient } from "@/lib/supabase/admin";
import type { ServiceProvider } from "@/lib/types";

export type MessageThread = {
  id: string;
  homeowner_user_id: string;
  provider_id: string;
  subject: string | null;
  last_message_at: string;
  created_at: string;
  provider?: ServiceProvider;
};

export type Message = {
  id: string;
  thread_id: string;
  sender_user_id: string | null;
  sender_role: "homeowner" | "pro" | "system";
  body: string;
  read_at: string | null;
  created_at: string;
};

export type ProQA = {
  id: string;
  provider_id: string;
  asker_name: string;
  asker_email: string | null;
  question: string;
  answer: string | null;
  answered_at: string | null;
  status: string;
  created_at: string;
};

export type AvailabilitySlot = {
  id: string;
  provider_id: string;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
};

export async function getUserMessageThreads(userId: string, asPro = false) {
  const admin = createDbClient();
  if (!admin) return [];

  if (asPro) {
    const { data: listings } = await admin
      .from("service_providers")
      .select("id")
      .eq("owner_user_id", userId);
    const providerIds = (listings || []).map((l: { id: string }) => l.id);
    if (!providerIds.length) return [];

    const { data } = await admin
      .from("message_threads")
      .select("*, service_providers(*)")
      .in("provider_id", providerIds)
      .order("last_message_at", { ascending: false });
    return (data || []) as MessageThread[];
  }

  const { data } = await admin
    .from("message_threads")
    .select("*, service_providers(*)")
    .eq("homeowner_user_id", userId)
    .order("last_message_at", { ascending: false });
  return (data || []) as MessageThread[];
}

export async function getThreadMessages(threadId: string) {
  const admin = createDbClient();
  if (!admin) return [];

  const { data } = await admin
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  return (data || []) as Message[];
}

export async function sendMessage(input: {
  threadId: string;
  senderUserId: string;
  senderRole: "homeowner" | "pro";
  body: string;
}) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const { data, error } = await admin
    .from("messages")
    .insert({
      thread_id: input.threadId,
      sender_user_id: input.senderUserId,
      sender_role: input.senderRole,
      body: input.body.trim(),
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };

  await admin
    .from("message_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", input.threadId);

  return { ok: true as const, id: data.id };
}

export async function createMessageThread(input: {
  homeownerUserId: string;
  providerId: string;
  subject?: string;
  initialMessage: string;
}) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const { data: thread, error } = await admin
    .from("message_threads")
    .upsert(
      {
        homeowner_user_id: input.homeownerUserId,
        provider_id: input.providerId,
        subject: input.subject ?? null,
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "homeowner_user_id,provider_id" }
    )
    .select("id")
    .single();

  if (error || !thread) return { ok: false as const, error: error?.message || "Failed" };

  await admin.from("messages").insert({
    thread_id: thread.id,
    sender_user_id: input.homeownerUserId,
    sender_role: "homeowner",
    body: input.initialMessage.trim(),
  });

  return { ok: true as const, threadId: thread.id };
}

export async function getSavedProviders(userId: string) {
  const admin = createDbClient();
  if (!admin) return [];

  const { data } = await admin
    .from("saved_providers")
    .select("*, service_providers(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data || []) as { id: string; provider_id: string; service_providers: ServiceProvider }[];
}

export async function toggleSavedProvider(userId: string, providerId: string) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const { data: existing } = await admin
    .from("saved_providers")
    .select("id")
    .eq("user_id", userId)
    .eq("provider_id", providerId)
    .maybeSingle();

  if (existing) {
    await admin.from("saved_providers").delete().eq("id", existing.id);
    return { ok: true as const, saved: false };
  }

  const { error } = await admin.from("saved_providers").insert({ user_id: userId, provider_id: providerId });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, saved: true };
}

export async function getProQA(providerId: string) {
  const admin = createDbClient();
  if (!admin) return [];

  const { data } = await admin
    .from("pro_qa")
    .select("*")
    .eq("provider_id", providerId)
    .in("status", ["answered", "pending"])
    .order("created_at", { ascending: false });
  return (data || []) as ProQA[];
}

export async function submitProQuestion(input: {
  providerId: string;
  askerName: string;
  askerEmail?: string;
  question: string;
}) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const { error } = await admin.from("pro_qa").insert({
    provider_id: input.providerId,
    asker_name: input.askerName,
    asker_email: input.askerEmail ?? null,
    question: input.question.trim(),
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function markReviewHelpful(reviewId: string, fingerprint: string) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return { ok: false as const, count: 0 };

  await admin.from("review_helpful").insert({ review_id: reviewId, voter_fingerprint: fingerprint });

  const { count } = await admin
    .from("review_helpful")
    .select("*", { count: "exact", head: true })
    .eq("review_id", reviewId);

  return { ok: true as const, count: count ?? 1 };
}

export async function getReviewHelpfulCounts(reviewIds: string[]) {
  const admin = createDbClient();
  if (!admin || !reviewIds.length) return {} as Record<string, number>;

  const { data } = await admin.from("review_helpful").select("review_id").in("review_id", reviewIds);
  const counts: Record<string, number> = {};
  for (const row of data || []) {
    const id = (row as { review_id: string }).review_id;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

export async function getAvailabilitySlots(providerId: string) {
  const admin = createDbClient();
  if (!admin) return generateMockSlots(providerId);

  const { data, error } = await admin
    .from("availability_slots")
    .select("*")
    .eq("provider_id", providerId)
    .eq("is_booked", false)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(28);

  if (error || !data?.length) return generateMockSlots(providerId);
  return data as AvailabilitySlot[];
}

function generateMockSlots(providerId: string): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const now = new Date();
  for (let d = 1; d <= 7; d++) {
    for (const hour of [9, 11, 14, 16]) {
      const start = new Date(now);
      start.setDate(start.getDate() + d);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(hour + 2);
      slots.push({
        id: `mock-${providerId}-${d}-${hour}`,
        provider_id: providerId,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        is_booked: (d + hour) % 5 === 0,
      });
    }
  }
  return slots.filter((s) => !s.is_booked);
}

export async function getUserBookings(userId: string) {
  const admin = createDbClient();
  if (!admin) return [];

  const { data } = await admin
    .from("bookings")
    .select("*, service_providers(display_name, slug, category_slug)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data || [];
}
