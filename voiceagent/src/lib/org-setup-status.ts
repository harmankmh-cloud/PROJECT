import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrgSetupStatus = {
  hasAgent: boolean;
  hasPhoneNumber: boolean;
  hasKnowledge: boolean;
  hasPublishedFlow: boolean;
};

export async function getOrgSetupStatus(orgId: string): Promise<OrgSetupStatus> {
  const admin = createAdminClient();

  const [agents, phones, telnyx, knowledge, flows] = await Promise.all([
    admin.from("va_agents").select("id", { count: "exact", head: true }).eq("org_id", orgId),
    admin.from("va_phone_numbers").select("id", { count: "exact", head: true }).eq("org_id", orgId),
    admin
      .from("va_telnyx_numbers")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", "active"),
    admin.from("va_knowledge_docs").select("id", { count: "exact", head: true }).eq("org_id", orgId),
    admin
      .from("va_flows")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("is_published", true),
  ]);

  const phoneCount = (phones.count ?? 0) + (telnyx.count ?? 0);

  return {
    hasAgent: (agents.count ?? 0) > 0,
    hasPhoneNumber: phoneCount > 0,
    hasKnowledge: (knowledge.count ?? 0) > 0,
    hasPublishedFlow: (flows.count ?? 0) > 0,
  };
}
