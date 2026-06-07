import { getPlatformTotals } from "@/lib/admin-data";
import { BRAND } from "@/lib/brand";

export default async function AdminPage() {
  const totals = await getPlatformTotals();

  return (
    <div className="space-y-8">
      <header>
        <p className="page-eyebrow">Platform panel</p>
        <h1 className="font-display mt-1 text-3xl text-ghost-white">{BRAND.name} admin</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Organizations, usage, and support messages.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Organizations", value: totals.orgCount },
          { label: "Agents", value: totals.agentCount },
          { label: "Calls", value: totals.callCount },
          { label: "Published flows", value: totals.flowCount },
        ].map((stat) => (
          <div key={stat.label} className="surface-card p-5">
            <p className="text-sm text-on-surface-variant">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-ghost-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Organizations</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Stripe</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {totals.orgs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-text">
                  No organizations yet.
                </td>
              </tr>
            ) : (
              totals.orgs.map((org) => (
                <tr key={org.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium">{org.name}</td>
                  <td className="px-5 py-3 capitalize">{org.plan || "starter"}</td>
                  <td className="px-5 py-3">{org.stripe_customer_id ? "Connected" : "—"}</td>
                  <td className="px-5 py-3">{new Date(org.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Recent support messages</h2>
        </div>
        <ul className="divide-y divide-glass-border-subtle">
          {totals.supportLogs.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-slate-text">No support messages yet.</li>
          ) : (
            totals.supportLogs.map((log) => {
              const meta = (log.metadata || {}) as {
                email?: string;
                category?: string;
                message?: string;
                orgName?: string;
              };
              return (
                <li key={log.id} className="px-5 py-4 text-sm">
                  <p className="font-medium text-ghost-white">
                    {meta.category || "help"} · {meta.email || "unknown"}
                  </p>
                  <p className="mt-1 text-on-surface-variant line-clamp-2">{meta.message}</p>
                  <p className="mt-1 text-xs text-slate-text">
                    {meta.orgName || log.org_id} · {new Date(log.created_at).toLocaleString()}
                  </p>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
