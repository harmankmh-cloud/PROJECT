import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { SetupChecklist } from "@/components/SetupChecklist";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { computeCallStats } from "@/lib/call-stats";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;

  let stats = { total: 0, containmentRate: 0, transferRate: 0, totalMinutes: 0 };
  let recentCalls: Array<{
    id: string;
    from_number: string | null;
    status: string;
    created_at: string;
    summary: string | null;
  }> = [];
  let setup = {
    hasAgent: false,
    hasPhoneNumber: false,
    hasKnowledge: false,
    hasPublishedFlow: false,
  };

  if (org) {
    const [
      { data: allCalls },
      { data: recent },
      { count: agentCount },
      { count: phoneCount },
      { count: knowledgeCount },
      { count: flowCount },
    ] = await Promise.all([
      supabase.from("va_calls").select("transferred, contained, duration_seconds").eq("org_id", org.id),
      supabase
        .from("va_calls")
        .select("id, from_number, status, created_at, summary")
        .eq("org_id", org.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("va_agents").select("id", { count: "exact", head: true }).eq("org_id", org.id),
      supabase.from("va_phone_numbers").select("id", { count: "exact", head: true }).eq("org_id", org.id),
      supabase.from("va_knowledge_docs").select("id", { count: "exact", head: true }).eq("org_id", org.id),
      supabase
        .from("va_flows")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id)
        .eq("is_published", true),
    ]);

    recentCalls = recent || [];
    stats = computeCallStats(allCalls || []);
    setup = {
      hasAgent: (agentCount || 0) > 0,
      hasPhoneNumber: (phoneCount || 0) > 0,
      hasKnowledge: (knowledgeCount || 0) > 0,
      hasPublishedFlow: (flowCount || 0) > 0,
    };
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="font-display text-2xl text-brand-900">Overview</h1>
        <p className="mt-1 text-slate-500">{org ? org.name : "Set up your organization"}</p>
      </header>

      {org && (
        <SetupChecklist
          orgName={org.name}
          hasAgent={setup.hasAgent}
          hasPhoneNumber={setup.hasPhoneNumber}
          hasKnowledge={setup.hasKnowledge}
          hasPublishedFlow={setup.hasPublishedFlow}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total calls" value={stats.total} />
        <StatCard label="Containment rate" value={`${stats.containmentRate}%`} hint="Resolved without human" />
        <StatCard label="Transfer rate" value={`${stats.transferRate}%`} />
        <StatCard label="Minutes used" value={stats.totalMinutes} />
      </div>

      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Recent calls</h2>
          <Link href="/dashboard/calls" className="text-sm text-teal-600 hover:underline">
            View all →
          </Link>
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
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  No calls yet.{" "}
                  <Link href="/dashboard/phone-numbers" className="text-teal-600 hover:underline">
                    Add a phone number
                  </Link>{" "}
                  to get started.
                </td>
              </tr>
            ) : (
              recentCalls.map((call) => (
                <tr key={call.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/calls/${call.id}`} className="text-teal-700 hover:underline">
                      {call.from_number || "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{call.status}</td>
                  <td className="max-w-xs truncate px-5 py-3">{call.summary || "—"}</td>
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
