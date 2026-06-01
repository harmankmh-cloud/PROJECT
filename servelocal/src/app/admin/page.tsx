import { AdminTradePanel } from "@/components/AdminTradePanel";
import { getAdminProviders, getAdminReviews, getAdminServiceRequests, getAdminSuggestions } from "@/lib/data";

export default async function AdminPage() {
  const [providers, requests, reviews, suggestions] = await Promise.all([
    getAdminProviders(),
    getAdminServiceRequests(),
    getAdminReviews(),
    getAdminSuggestions(),
  ]);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="page-eyebrow">ServeLocal</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-zinc-900">Service directory</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Approve listings, verify pros, moderate reviews, set plans ($49/$99). Public site:{" "}
            <a href="/" className="font-semibold text-accent-600 hover:underline">
              homepage
            </a>
          </p>
        </header>
        <AdminTradePanel
          providers={providers}
          requests={requests}
          reviews={reviews}
          suggestions={suggestions}
        />
      </div>
    </main>
  );
}
