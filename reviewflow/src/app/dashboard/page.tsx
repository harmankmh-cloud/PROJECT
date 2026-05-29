import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SetupBusinessForm } from "@/components/Forms";
import { QrCard } from "@/components/QrCard";
import { AiToolsPanel } from "@/components/AiToolsPanel";
import Link from "next/link";
import type { DashboardStats, FeedbackEvent } from "@/lib/types";

async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) {
    return { user, business: null, prompts: [], feedback: [], stats: null };
  }

  const [{ data: prompts }, { data: feedback }, { data: analytics }] = await Promise.all([
    supabase.from("prompt_templates").select("*").eq("business_id", business.id),
    supabase
      .from("feedback_events")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("analytics_events").select("event_type").eq("business_id", business.id),
  ]);

  const stats: DashboardStats = {
    pageViews: analytics?.filter((item) => item.event_type === "page_view").length || 0,
    googleClicks: analytics?.filter((item) => item.event_type === "google_click").length || 0,
    privateFeedback: analytics?.filter((item) => item.event_type === "private_feedback").length || 0,
    publicDrafts: analytics?.filter((item) => item.event_type === "copy_review").length || 0,
  };

  return {
    user,
    business,
    prompts: prompts || [],
    feedback: (feedback || []) as FeedbackEvent[],
    stats,
  };
}

export default async function DashboardPage() {
  const { business, feedback, stats } = await getDashboardData();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!business) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <SetupBusinessForm />
      </main>
    );
  }

  const reviewUrl = `${appUrl}/r/${business.slug}`;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-700">ReviewFlow dashboard</p>
            <h1 className="text-3xl font-semibold text-zinc-900">{business.name}</h1>
            <p className="mt-1 text-sm text-zinc-600">Manage your review link, feedback, and marketing helpers.</p>
          </div>
          <Link
            href={`/r/${business.slug}`}
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
          >
            Preview customer page
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Page visits", stats?.pageViews || 0],
            ["Google clicks", stats?.googleClicks || 0],
            ["Review copies", stats?.publicDrafts || 0],
            ["Private feedback", stats?.privateFeedback || 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <QrCard url={reviewUrl} businessName={business.name} />
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Business settings</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">Review link</dt>
                <dd className="break-all font-medium text-zinc-800">{reviewUrl}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Business type</dt>
                <dd className="font-medium text-zinc-800">{business.business_type}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Google review link</dt>
                <dd className="break-all font-medium text-zinc-800">
                  {business.google_review_url || "Not set yet"}
                </dd>
              </div>
            </dl>
            <Link
              href="/dashboard/prompts"
              className="mt-6 inline-block rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Edit review prompts
            </Link>
          </div>
        </section>

        <AiToolsPanel />

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Recent feedback</h2>
          {feedback.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600">No feedback yet. Share your QR code to get started.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="rounded-2xl bg-zinc-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                      {item.experience_level}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    {item.is_private && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        private
                      </span>
                    )}
                  </div>
                  {item.ai_draft && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">{item.ai_draft}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
