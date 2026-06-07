import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function logAudit(params: {
  orgId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const admin = createAdminClient();
  await admin.from("va_audit_logs").insert({
    org_id: params.orgId,
    user_id: params.userId,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId,
    metadata: params.metadata || {},
  });
}
