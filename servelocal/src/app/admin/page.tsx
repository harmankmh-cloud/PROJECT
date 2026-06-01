import Link from "next/link";
import { AdminTradePanel } from "@/components/AdminTradePanel";
import { getAdminProviders, getAdminReviews, getAdminServiceRequests, getAdminSuggestions } from "@/lib/data";

export default async function AdminPage() {
  const [providers, requests, reviews, suggestions] = await Promise.all([
    getAdminProviders(),
    getAdminServiceRequests(),
    getAdminReviews(),
    getAdminSuggestions(),
  ]);

  const pendingProviders = providers.filter((p) => p.status === "pending").length;
  const openRequests = requests.filter((r) => r.status === "open").length;

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="page-eyebrow">ServeLocal</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-zinc-900">Admin</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Approve listings, moderate reviews, manage job requests. Public site:{" "}
            <Link href="/" className="font-semibold text-teal-600 hover:underline">
              homepage
            </Link>
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">{pendingProviders}</p>
            <p className="text-xs text-slate-500">Pending listings</p>
          </div>
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">{openRequests}</p>
            <p className="text-xs text-slate-500">Open job requests</p>
          </div>
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">{reviews.length}</p>
            <p className="text-xs text-slate-500">Reviews to moderate</p>
          </div>
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">
              {suggestions.filter((s) => s.status === "new").length}
            </p>
            <p className="text-xs text-slate-500">New suggestions</p>
          </div>
        </div>

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
