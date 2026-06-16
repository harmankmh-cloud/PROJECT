import { redirect } from "next/navigation";
import { ReviewList } from "@/components/ReviewList";
import { StarRating } from "@/components/StarRating";
import { getProviderReviewsForProvider, getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";

export default async function ProReviewsPage() {
  const supabase = await createClient();
  const user = await getServerAuthUser();
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const reviews = await getProviderReviewsForProvider(listing.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-slate-900">Reviews</h1>
      <div className="mt-4">
        <StarRating rating={listing.avg_rating ?? 0} count={listing.review_count} />
      </div>
      <div className="mt-8">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
