import { redirect } from "next/navigation";
import { FeedbackInbox } from "@/components/FeedbackInbox";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function ReviewsPage() {
  const { business, feedback, feedbackTotal } = await getDashboardData();

  if (!business) redirect("/dashboard");

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your dashboard</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">My reviews</h1>
          <p className="mt-2 text-sm text-stone-500">
            All reviews for {business.name} — load more or export CSV anytime.
          </p>
        </header>
        <FeedbackInbox initialFeedback={feedback} totalCount={feedbackTotal} />
      </div>
    </main>
  );
}
