import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Camera, ThumbsUp } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ReviewCard } from "@/components/business/ReviewCard";
import { getUserProfile, getUserReviews, getTierLabel } from "@/lib/user-profile";
import { FadeInSection } from "@/components/ui/FadeInSection";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserProfile(id);
  return { title: user ? `${user.display_name}'s Reviews` : "User Profile" };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUserProfile(id);
  if (!user) notFound();

  const reviews = await getUserReviews(id);

  return (
    <main>
      <LandingNavbar />
      <div className="marketing-container py-12">
        <FadeInSection className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {user.display_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="mt-4 sm:ml-6 sm:mt-0">
            <h1 className="font-display text-2xl font-bold text-text">{user.display_name}</h1>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-star/10 px-3 py-1 text-sm font-medium text-star">
              <BadgeCheck className="h-4 w-4" />
              {getTierLabel(user.tier)}
            </span>
            {user.city && <p className="mt-2 text-sm text-muted">{user.city}</p>}
            <p className="mt-1 text-xs text-muted">
              Member since {new Date(user.joined_at).toLocaleDateString("en-CA", { month: "long", year: "numeric" })}
            </p>
          </div>
          <button type="button" className="btn-ghost mt-4 sm:ml-auto sm:mt-0">
            Follow
          </button>
        </FadeInSection>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Reviews", value: user.review_count },
            { label: "Photos", value: user.photo_count, icon: Camera },
            { label: "Helpful received", value: user.helpful_received, icon: ThumbsUp },
            { label: "Helpful given", value: user.helpful_given, icon: ThumbsUp },
          ].map((stat) => (
            <div key={stat.label} className="card-glow p-4 text-center">
              <p className="font-display text-2xl font-bold text-text">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-text">Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted">No public reviews yet.</p>
            ) : (
              reviews.map((r) => <ReviewCard key={r.id} review={r} />)
            )}
          </div>
        </section>
      </div>
      <LandingFooter />
    </main>
  );
}
