import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getPlatformTotals() {
  const admin = createAdminClient();

  const [
    { count: orgCount },
    { count: agentCount },
    { count: callCount },
    { count: flowCount },
    { data: orgs },
    { data: supportLogs },
  ] = await Promise.all([
    admin.from("va_organizations").select("id", { count: "exact", head: true }),
    admin.from("va_agents").select("id", { count: "exact", head: true }),
    admin.from("va_calls").select("id", { count: "exact", head: true }),
    admin.from("va_flows").select("id", { count: "exact", head: true }),
    admin
      .from("va_organizations")
      .select("id, name, plan, stripe_customer_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("va_audit_logs")
      .select("id, org_id, action, metadata, created_at")
      .eq("action", "support.message")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    orgCount: orgCount || 0,
    agentCount: agentCount || 0,
    callCount: callCount || 0,
    flowCount: flowCount || 0,
    orgs: orgs || [],
    supportLogs: supportLogs || [],
  };
}
