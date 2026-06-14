import Link from "next/link";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { getPendingReviewBookings } from "@/lib/data/bookings";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { getUserProfile } from "@/lib/user-profiles";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const user = await getServerAuthUser();

  const profile = user ? await getUserProfile(user.id) : null;
  const pending = user
    ? await getPendingReviewBookings(user.id, profile?.display_name ?? undefined)
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Reviews</h1>
      <p className="mt-1 text-sm text-muted">Leave reviews for completed jobs</p>

      {pending.length > 0 ? (
        <div className="mt-6 rounded-[14px] border border-amber-400/30 bg-amber-400/5 p-5">
          <p className="font-semibold text-foreground">
            You have {pending.length} review{pending.length === 1 ? "" : "s"} pending
          </p>
          <ul className="mt-4 space-y-3">
            {pending.map((r) => (
              <li
                key={r.bookingId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{r.providerName}</p>
                  <p className="text-xs text-muted">
                    {r.serviceDescription.slice(0, 80)}
                    {r.serviceDescription.length > 80 ? "…" : ""} ·{" "}
                    {new Date(r.completedAt).toLocaleDateString("en-CA")}
                  </p>
                </div>
                <Link href={r.providerSlug ? `/pro/${r.providerSlug}#review` : `/pros/${r.providerId}#review`}>
                  <ShimmerButton size="sm">Leave Review</ShimmerButton>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-8 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-muted">No pending reviews — complete a booking to leave feedback.</p>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">Reviews you&apos;ve left will appear on each pro&apos;s profile.</p>
    </div>
  );
}
