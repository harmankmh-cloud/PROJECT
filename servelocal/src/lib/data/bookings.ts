import { createServiceClient } from "@/lib/supabase/admin";
import { createUserDbClient } from "@/lib/supabase/user-db";
import { parseBooking } from "@/lib/schemas/db/booking";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";

export type BookingWithProvider = Booking & {
  service_providers?: { display_name?: string; slug?: string; category_slug?: string } | null;
};

const BOOKING_SELECT = "*, service_providers(display_name, slug, category_slug)";

export async function getUserBookings(userId: string): Promise<BookingWithProvider[]> {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return [];

  const { data, error } = await ctx.supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(parseBooking).filter((b): b is BookingWithProvider => b !== null);
}

export async function getBookingById(bookingId: string, userId: string): Promise<BookingWithProvider | null> {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return null;

  const { data, error } = await ctx.supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !data) return null;
  const booking = parseBooking(data);
  if (!booking || booking.user_id !== userId) return null;
  return booking as BookingWithProvider;
}

export async function updateBookingQuoteAction(
  bookingId: string,
  userId: string,
  action: "accept" | "decline"
) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return { ok: false as const, error: "Not configured" };

  const booking = await getBookingById(bookingId, userId);
  if (!booking) return { ok: false as const, error: "Booking not found" };

  const status: BookingStatus = action === "accept" ? "confirmed" : "cancelled";
  const { error } = await ctx.supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("user_id", userId);

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function updateBookingPaymentStatus(bookingId: string, paymentStatus: PaymentStatus) {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const patch: Record<string, unknown> = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  };
  if (paymentStatus === "held") patch.status = "confirmed";

  const { error } = await admin.from("bookings").update(patch).eq("id", bookingId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function linkBookingToUser(bookingId: string, userId: string) {
  const admin = createServiceClient();
  if (!admin) return;

  await admin
    .from("bookings")
    .update({ user_id: userId, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .is("user_id", null);
}

export type PendingReviewItem = {
  bookingId: string;
  providerId: string;
  providerName: string;
  providerSlug: string | null;
  serviceDescription: string;
  completedAt: string;
};

export async function getPendingReviewBookings(
  userId: string,
  displayName?: string
): Promise<PendingReviewItem[]> {
  const bookings = await getUserBookings(userId);
  const completed = bookings.filter((b) => b.status === "completed");
  if (!completed.length) return [];

  const admin = createServiceClient();
  if (!admin) return [];

  const providerIds = [...new Set(completed.map((b) => b.provider_id))];
  const { data: reviews } = await admin
    .from("provider_reviews")
    .select("provider_id, reviewer_name")
    .in("provider_id", providerIds);

  const reviewed = new Set(
    (reviews || []).map((r: { provider_id: string; reviewer_name: string }) =>
      `${r.provider_id}:${r.reviewer_name.toLowerCase()}`
    )
  );

  const reviewerKey = (displayName || userId).toLowerCase();

  return completed
    .filter((b) => !reviewed.has(`${b.provider_id}:${reviewerKey}`))
    .map((b) => ({
      bookingId: b.id,
      providerId: b.provider_id,
      providerName: b.service_providers?.display_name ?? "Pro",
      providerSlug: b.service_providers?.slug ?? null,
      serviceDescription: b.service_description,
      completedAt: b.updated_at || b.created_at,
    }));
}

export async function getHomeownerDashboardCounts(userId: string) {
  const [bookings, threads, pendingReviews, requests] = await Promise.all([
    getUserBookings(userId),
    import("@/lib/features-data").then((m) => m.getUserMessageThreads(userId)),
    getPendingReviewBookings(userId),
    import("@/lib/data/requests").then((m) => m.getUserServiceRequests(userId)),
  ]);

  const openQuotes = bookings.filter(
    (b) => b.status === "pending" || (b.status === "confirmed" && b.payment_status === "held")
  ).length;

  const activeJobs = requests.filter((r) => r.status !== "completed" && r.status !== "closed").length;

  return {
    openQuotes,
    pendingReviews: pendingReviews.length,
    unreadMessages: threads.length,
    activeBookings: bookings.filter((b) => b.status === "confirmed" || b.status === "in_progress").length,
    activeJobs,
  };
}

export function isPaidBooking(booking: Booking) {
  return (
    booking.payment_status === "held" ||
    booking.payment_status === "released" ||
    booking.payment_status === "refunded"
  );
}
