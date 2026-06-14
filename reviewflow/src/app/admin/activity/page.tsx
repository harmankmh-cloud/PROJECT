import { getPlatformActivity } from "@/lib/admin-data";

export default async function AdminActivityPage() {
  const activity = await getPlatformActivity(80);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Activity</h1>
          <p className="mt-2 text-sm text-stone-500">
            Recent signups and customer reviews across RateLocal.
          </p>
        </header>

        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-cream text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">When</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Business</th>
                  <th className="px-4 py-3 font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {activity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No activity yet.
                    </td>
                  </tr>
                ) : (
                  activity.map((row) => (
                    <tr key={row.id} className="hover:bg-cream/50">
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.type === "signup"
                              ? "bg-blue-100 text-blue-800"
                              : row.type === "review"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-brand-950">{row.businessName}</td>
                      <td className="max-w-md truncate px-4 py-4 text-slate-600">{row.detail}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
