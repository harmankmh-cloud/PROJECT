import { StatCard } from "@/components/StatCard";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;

  let stats = { total: 0, containmentRate: 0, transferRate: 0, totalMinutes: 0 };
  let recentCalls: Array<{
    id: string;
    from_number: string | null;
    status: string;
    created_at: string;
    summary: string | null;
    contained?: boolean | null;
    transferred?: boolean;
    duration_seconds?: number;
  }> = [];

  if (org) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002"}/api/calls`, {
      headers: { cookie: "" },
    }).catch(() => null);

    if (!res?.ok) {
      const { data: calls } = await supabase
        .from("va_calls")
        .select("id, from_number, status, created_at, summary, transferred, contained, duration_seconds")
        .eq("org_id", org.id)
        .order("created_at", { ascending: false })
        .limit(10);

      recentCalls = calls || [];
      const total = recentCalls.length;
      stats = {
        total,
        containmentRate: total ? Math.round((recentCalls.filter((c) => c.contained).length / total) * 100) : 0,
        transferRate: total ? Math.round((recentCalls.filter((c) => c.transferred).length / total) * 100) : 0,
        totalMinutes: recentCalls.reduce((s, c) => s + Math.ceil(((c as { duration_seconds?: number }).duration_seconds || 0) / 60), 0),
      };
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Overview</h1>
      <p className="mt-1 text-slate-500">{org ? org.name : "Set up your organization"}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total calls" value={stats.total} />
        <StatCard label="Containment rate" value={`${stats.containmentRate}%`} hint="Resolved without human" />
        <StatCard label="Transfer rate" value={`${stats.transferRate}%`} />
        <StatCard label="Minutes used" value={stats.totalMinutes} />
      </div>

      <div className="mt-8 surface-card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Recent calls</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3">From</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Summary</th>
              <th className="px-5 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">No calls yet. Connect a Telnyx number to get started.</td></tr>
            ) : (
              recentCalls.map((call) => (
                <tr key={call.id} className="border-t border-slate-100">
                  <td className="px-5 py-3">{call.from_number || "—"}</td>
                  <td className="px-5 py-3">{call.status}</td>
                  <td className="px-5 py-3 max-w-xs truncate">{call.summary || "—"}</td>
                  <td className="px-5 py-3">{new Date(call.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
