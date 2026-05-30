import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupBusinessForm } from "@/components/Forms";
import { QrCard } from "@/components/QrCard";
import { AiToolsPanel } from "@/components/AiToolsPanel";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const { business, feedback, stats } = await getDashboardData();

  if (!business) {
    return (
      <main className="px-6 py-10">
        <SetupBusinessForm />
      </main>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  return (
    <main className="px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{business.name}</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Track review activity, share your QR code, and create marketing content from customer feedback.
          </p>
        </div>

        {!business.google_review_url && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add your Google review link in{" "}
            <Link href="/dashboard/settings" className="font-semibold underline">
              Settings
            </Link>{" "}
            so customers can post reviews after copying their draft.
          </div>
        )}

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
            <h2 className="text-lg font-semibold text-zinc-900">Quick actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`/r/${business.slug}`}
                target="_blank"
                className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Preview customer page
              </Link>
              <Link
                href="/dashboard/settings"
                className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Edit business settings
              </Link>
              <Link
                href="/dashboard/prompts"
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Edit review prompts
              </Link>
            </div>
            <dl className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-sm">
              <div>
                <dt className="text-zinc-500">Review link</dt>
                <dd className="break-all font-medium text-zinc-800">{reviewUrl}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Business type</dt>
                <dd className="font-medium text-zinc-800">{business.business_type}</dd>
              </div>
            </dl>
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
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-zinc-700">
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
                  {item.customer_notes && (
                    <p className="mt-3 text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">Customer wrote:</span> {item.customer_notes}
                    </p>
                  )}
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
