import Link from "next/link";
import { ActivityFeedItem } from "@/components/dashboard/ActivityFeedItem";
import { VolumeSparkline } from "@/components/dashboard/VolumeSparkline";
import { MaterialIcon } from "@/components/MaterialIcon";
import { SetupChecklist } from "@/components/SetupChecklist";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { reconcileStaleCalls } from "@/lib/call-reconciliation";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildAnalytics } from "@/lib/analytics";
import { isUnclassifiedIntent } from "@/lib/intent-display";

function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function callerLabel(fromNumber: string | null) {
  if (!fromNumber) return "Unknown caller";
  const digits = fromNumber.replace(/\D/g, "");
  if (digits.length >= 4) return `Caller ···${digits.slice(-4)}`;
  return fromNumber;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;

  let activeAgents = 0;
  let channelCount = 0;
  let todayCalls = 0;
  let volumeDelta: number | null = null;
  let sparklineValues = [0, 0, 0, 0, 0, 0, 0];
  let unclassifiedToday = 0;
  let recentCalls: Array<{
    id: string;
    from_number: string | null;
    status: string;
    created_at: string;
    summary: string | null;
    intent: string | null;
  }> = [];
  let setup = {
    hasAgent: false,
    hasPhoneNumber: false,
    hasKnowledge: false,
    hasPublishedFlow: false,
  };

  if (org) {
    try {
      const admin = createAdminClient();
      await reconcileStaleCalls(admin, org.id);
    } catch {
      // Admin client optional in dev
    }

    const today = dayKey();
    const yesterday = dayKey(new Date(Date.now() - 86_400_000));

    const [
      { data: allCalls },
      { data: recent },
      { count: agentCount },
      { count: activeAgentCount },
      { count: phoneCount },
      { count: knowledgeCount },
      { count: flowCount },
      { data: channels },
      { data: todayRows },
      { data: yesterdayRows },
    ] = await Promise.all([
      supabase
        .from("va_calls")
        .select("created_at, agent_id, sentiment, score, duration_seconds, transferred, contained, intent, handoff_payload")
        .eq("org_id", org.id),
      supabase
        .from("va_calls")
        .select("id, from_number, status, created_at, summary, intent")
        .eq("org_id", org.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("va_agents").select("id", { count: "exact", head: true }).eq("org_id", org.id),
      supabase
        .from("va_agents")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id)
        .eq("is_active", true),
      supabase.from("va_phone_numbers").select("id", { count: "exact", head: true }).eq("org_id", org.id),
      supabase.from("va_knowledge_docs").select("id", { count: "exact", head: true }).eq("org_id", org.id),
      supabase
        .from("va_flows")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id)
        .eq("is_published", true),
      supabase.from("va_channels").select("is_active").eq("org_id", org.id),
      supabase
        .from("va_calls")
        .select("id, intent")
        .eq("org_id", org.id)
        .gte("created_at", `${today}T00:00:00`),
      supabase
        .from("va_calls")
        .select("id")
        .eq("org_id", org.id)
        .gte("created_at", `${yesterday}T00:00:00`)
        .lt("created_at", `${today}T00:00:00`),
    ]);

    recentCalls = recent || [];
    activeAgents = activeAgentCount || 0;
    const activeChannels = (channels || []).filter((c) => c.is_active).length;
    channelCount = (phoneCount || 0) + activeChannels;
    todayCalls = todayRows?.length || 0;
    const yesterdayCalls = yesterdayRows?.length || 0;
    if (yesterdayCalls > 0) {
      volumeDelta = Math.round(((todayCalls - yesterdayCalls) / yesterdayCalls) * 100);
    } else if (todayCalls > 0) {
      volumeDelta = 100;
    }

    unclassifiedToday = (todayRows || []).filter((c) => isUnclassifiedIntent(c.intent)).length;

    const analytics = buildAnalytics(allCalls || [], 7);
    sparklineValues = analytics.volumeTrend.slice(-7).map((d) => d.calls);
    while (sparklineValues.length < 7) sparklineValues.unshift(0);

    setup = {
      hasAgent: (agentCount || 0) > 0,
      hasPhoneNumber: (phoneCount || 0) > 0,
      hasKnowledge: (knowledgeCount || 0) > 0,
      hasPublishedFlow: (flowCount || 0) > 0,
    };
  }

  const setupComplete =
    setup.hasAgent && setup.hasPhoneNumber && setup.hasKnowledge && setup.hasPublishedFlow;
  const systemsHealthy = setupComplete && activeAgents > 0;

  return (
    <main className="dashboard-container pb-8 pt-4">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-on-surface">
          {systemsHealthy ? "Systems Healthy" : "Getting started"}
        </h1>
        <p className="mt-2 text-on-primary-container">
          {org
            ? systemsHealthy
              ? `Your AI workforce is currently managing ${channelCount} active channel${channelCount === 1 ? "" : "s"}.`
              : `Finish setup for ${org.name} to start answering calls.`
            : "Create your organization to deploy AI phone agents."}
        </p>
      </header>

      {org && !setupComplete && (
        <div className="mb-10">
          <SetupChecklist
            orgName={org.name}
            hasAgent={setup.hasAgent}
            hasPhoneNumber={setup.hasPhoneNumber}
            hasKnowledge={setup.hasKnowledge}
            hasPublishedFlow={setup.hasPublishedFlow}
          />
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="glass-card relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl p-6">
          <div className="z-10">
            <div className="mb-4 flex items-center gap-2">
              <MaterialIcon name="support_agent" filled className="text-secondary" />
              <span className="text-sm font-semibold text-secondary">Operational Status</span>
            </div>
            <div className="text-[40px] font-extrabold leading-tight tracking-tight text-ghost-white">
              {activeAgents} Agent{activeAgents === 1 ? "" : "s"} Online
            </div>
          </div>
          <div className="z-10 mt-2 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-on-tertiary-container" />
            <span className="text-xs font-semibold text-on-tertiary-container">
              {activeAgents > 0 ? "Real-time sync active" : "Activate an agent to go live"}
            </span>
          </div>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-secondary/5 blur-2xl" />
        </div>

        <div className="glass-card flex min-h-[160px] flex-col justify-between rounded-xl p-6">
          <div>
            <div className="mb-2 flex items-start justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-on-primary-container">
                Today&apos;s Volume
              </span>
              {volumeDelta != null && (
                <span className="rounded bg-secondary-fixed px-2 py-1 text-xs font-semibold text-on-secondary-fixed">
                  {volumeDelta >= 0 ? "+" : ""}
                  {volumeDelta}%
                </span>
              )}
            </div>
            <div className="text-[40px] font-extrabold leading-tight tracking-tight text-ghost-white">
              {todayCalls} Call{todayCalls === 1 ? "" : "s"}
            </div>
          </div>
          <VolumeSparkline values={sparklineValues} />
        </div>
      </div>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
          <Link href="/dashboard/calls" className="text-sm font-semibold text-secondary hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {recentCalls.length === 0 ? (
            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-center text-sm text-on-primary-container">
              No calls yet.{" "}
              <Link href="/dashboard/phone-numbers" className="font-semibold text-secondary hover:underline">
                Add a phone number
              </Link>{" "}
              to get started.
            </div>
          ) : (
            recentCalls.map((call) => (
              <ActivityFeedItem
                key={call.id}
                id={call.id}
                label={callerLabel(call.from_number)}
                summary={call.summary}
                intent={call.intent}
                createdAt={call.created_at}
              />
            ))
          )}
        </div>
      </section>

      {unclassifiedToday > 0 && (
        <div className="glow-border relative mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container to-brand-900 p-6">
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Training Session Available</h3>
            <p className="mt-2 mb-4 text-sm text-on-primary-container">
              Improve agent accuracy by reviewing {unclassifiedToday} new unclassified intent
              {unclassifiedToday === 1 ? "" : "s"} from today.
            </p>
            <Link
              href="/dashboard/calls"
              className="btn-primary inline-block rounded-full px-6 py-3 text-sm"
            >
              Start Review
            </Link>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20">
            <div className="h-full w-full bg-gradient-to-l from-electric-blue to-transparent" />
          </div>
          <MaterialIcon
            name="psychology"
            className="absolute -bottom-4 -right-4 rotate-12 text-9xl text-white/5"
          />
        </div>
      )}
    </main>
  );
}
