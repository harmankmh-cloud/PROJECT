import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

let migrationApplied: boolean | null = null;

/** Whether migration 009 billing columns exist on va_organizations. */
export async function isBillingMigrationApplied(): Promise<boolean> {
  if (migrationApplied !== null) return migrationApplied;
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("va_organizations")
      .select("subscription_status")
      .limit(1);
    migrationApplied = !error;
  } catch {
    migrationApplied = false;
  }
  return migrationApplied;
}

const BILLING_ORG_FIELDS =
  "subscription_status, access_until, spending_limit_cents, overage_blocked, billing_period_start, billing_period_end";

const BILLING_UPDATE_KEYS = new Set([
  "subscription_status",
  "access_until",
  "spending_limit_cents",
  "overage_blocked",
  "billing_period_start",
  "billing_period_end",
]);

/** Org columns for telephony / usage queries — omits billing fields until migration 009 is applied. */
export async function orgSelectFields(base: string): Promise<string> {
  if (await isBillingMigrationApplied()) {
    return `${base}, ${BILLING_ORG_FIELDS}`;
  }
  return base;
}

/** Strip billing-only update fields when migration 009 has not been applied yet. */
export async function orgUpdateFields(
  fields: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (await isBillingMigrationApplied()) return fields;
  return Object.fromEntries(
    Object.entries(fields).filter(([key]) => !BILLING_UPDATE_KEYS.has(key))
  );
}
