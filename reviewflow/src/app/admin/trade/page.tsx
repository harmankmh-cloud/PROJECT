import { AdminTradePanel } from "@/components/tradelocal/AdminTradePanel";
import { getAdminProviders, getAdminServiceRequests } from "@/lib/tradelocal/data";

export default async function AdminTradePage() {
  const [providers, requests] = await Promise.all([
    getAdminProviders(),
    getAdminServiceRequests(),
  ]);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="page-eyebrow">TradeLocal</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Service directory</h1>
          <p className="mt-2 text-sm text-slate-600">
            Approve tradie listings and read customer job requests. Public site:{" "}
            <a href="/trade" className="font-semibold text-teal-600 hover:underline">
              /trade
            </a>
          </p>
        </header>
        <AdminTradePanel providers={providers} requests={requests} />
      </div>
    </main>
  );
}
