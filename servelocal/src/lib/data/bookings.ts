import { createDbClient, createServiceClient } from "@/lib/supabase/admin";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";

export type BookingWithProvider = Booking & {
  service_providers?: { display_name?: string; slug?: string; category_slug?: string } | null;
};

const BOOKING_SELECT = "*, service_providers(display_name, slug, category_slug)";

export async function getUserBookings(userId: string, email?: string): Promise<BookingWithProvider[]> {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return [];

  const { data: byUser } = await admin
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (byUser?.length) return byUser as BookingWithProvider[];

  if (!email) return [];

  const { data: byEmail } = await admin
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  return (byEmail || []) as BookingWithProvider[];
}

export async function getBookingById(
  bookingId: string,
  userId: string,
  email?: string
): Promise<BookingWithProvider | null> {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return null;

  const { data } = await admin.from("bookings").select(BOOKING_SELECT).eq("id", bookingId).maybeSingle();
  if (!data) return null;

  const booking = data as BookingWithProvider;
  if (booking.user_id === userId) return booking;
  if (email && booking.customer_email.toLowerCase() === email.toLowerCase()) return booking;
  return null;
}

export async function updateBookingQuoteAction(
  bookingId: string,
  userId: string,
  email: string | undefined,
  action: "accept" | "decline"
) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const booking = await getBookingById(bookingId, userId, email);
  if (!booking) return { ok: false as const, error: "Booking not found" };

  const status: BookingStatus = action === "accept" ? "confirmed" : "cancelled";
  const { error } = await admin
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId);

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
  email?: string,
  displayName?: string
): Promise<PendingReviewItem[]> {
  const bookings = await getUserBookings(userId, email);
  const completed = bookings.filter((b) => b.status === "completed");
  if (!completed.length) return [];

  const admin = createDbClient();
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

  const reviewerKey = (displayName || email || userId).toLowerCase();

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

export async function getHomeownerDashboardCounts(userId: string, email?: string) {
  const [bookings, threads, pendingReviews, requests] = await Promise.all([
    getUserBookings(userId, email),
    import("@/lib/features-data").then((m) => m.getUserMessageThreads(userId)),
    getPendingReviewBookings(userId, email),
    import("@/lib/data/requests").then((m) => m.getUserServiceRequests(userId, email)),
  ]);

  const openQuotes = bookings.filter(
    (b) => b.status === "pending" || (b.status === "confirmed" && b.payment_status === "held")
  ).length;

  const activeJobs = requests.filter(
    (r) => r.status !== "completed" && r.status !== "closed"
  ).length;

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
