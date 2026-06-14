import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PLANS,
  PAYMENT_GRACE_DAYS,
  type PlanKey,
  planConcurrentCalls,
  planMaxAgents,
} from "@/lib/plans";
import {
  billingPeriodStart,
  fetchPeriodUsageEvents,
  summarizeUsage,
} from "@/lib/usage-metering";
import { isBillingMigrationApplied } from "@/lib/billing-schema";
import {
  canMakeProductionCall as trialCanMakeProductionCall,
  canMakeSandboxTestCall,
  canPurchasePhoneNumber as trialCanPurchasePhoneNumber,
  hasActiveSubscription as trialHasSubscription,
  isTrialPlan,
  productionBlockReason as trialProductionBlockReason,
  sandboxBlockReason,
  phonePurchaseBlockReason,
  trialMinutesRemaining,
  type TrialOrg,
} from "@/lib/trial";

export type BillingOrg = TrialOrg & {
  id?: string;
  subscription_status?: string | null;
  billing_period_start?: string | null;
  billing_period_end?: string | null;
  access_until?: string | null;
  spending_limit_cents?: number | null;
  overage_blocked?: boolean | null;
};

const PAID_ACCESS_STATUSES = new Set(["active", "trialing"]);
const GRACE_STATUSES = new Set(["past_due"]);

export function subscriptionStatus(org: BillingOrg): string | null {
  return org.subscription_status ?? null;
}

/** Subscription exists in Stripe (may be past_due or canceled-at-period-end). */
export function hasSubscriptionRecord(org: BillingOrg): boolean {
  return trialHasSubscription(org);
}

/** Good standing for paid features (not blocked by payment failure). */
export function hasPaidAccess(org: BillingOrg): boolean {
  if (!hasSubscriptionRecord(org)) return false;

  const status = subscriptionStatus(org);
  if (!status) return true; // legacy rows before migration
  if (PAID_ACCESS_STATUSES.has(status)) return true;

  if (GRACE_STATUSES.has(status) && org.access_until) {
    return new Date(org.access_until).getTime() > Date.now();
  }

  if (status === "canceled" && org.access_until) {
    return new Date(org.access_until).getTime() > Date.now();
  }

  return false;
}

export function isPaymentPastDue(org: BillingOrg): boolean {
  const status = subscriptionStatus(org);
  return status === "past_due" || status === "unpaid";
}

export function planKeyForOrg(org: BillingOrg): PlanKey | null {
  const plan = org.plan ?? "trial";
  if (plan in PLANS) return plan as PlanKey;
  return null;
}

export function maxAgentsForOrg(org: BillingOrg): number {
  const key = planKeyForOrg(org);
  if (!key) return 1;
  return planMaxAgents(key);
}

export function concurrentCallsForOrg(org: BillingOrg): number {
  const key = planKeyForOrg(org);
  if (!key) return 1;
  return planConcurrentCalls(key);
}

/** Production voice calls (inbound/outbound/campaign). */
export function canMakeProductionCall(org: BillingOrg): boolean {
  if (org.overage_blocked) return false;

  if (hasSubscriptionRecord(org)) {
    if (!hasPaidAccess(org)) {
      return false;
    }
    return true;
  }

  return trialCanMakeProductionCall(org);
}

export async function isOverSpendingLimit(
  admin: SupabaseClient,
  org: BillingOrg
): Promise<boolean> {
  const limitCents = org.spending_limit_cents;
  if (!limitCents || limitCents <= 0 || !org.id) return false;

  const key = planKeyForOrg(org);
  if (!key) return false;

  const periodStart = billingPeriodStart(org);
  const events = await fetchPeriodUsageEvents(admin, org.id, periodStart);
  const { overageMinutes } = summarizeUsage(events, PLANS[key].includedMinutes);
  const estOverageCents = Math.round(overageMinutes * PLANS[key].perMinute * 100);

  return estOverageCents >= limitCents;
}

export async function canMakeProductionCallAsync(
  admin: SupabaseClient,
  org: BillingOrg
): Promise<boolean> {
  if (!canMakeProductionCall(org)) return false;
  if (hasPaidAccess(org) && org.id && (await isOverSpendingLimit(admin, org))) {
    return false;
  }
  return true;
}

export function productionBlockReason(org: BillingOrg): string {
  if (org.overage_blocked) {
    return "Voice calls are paused — your overage spending limit was reached. Raise the limit in Billing settings or wait for the next billing period.";
  }

  if (hasSubscriptionRecord(org) && !hasPaidAccess(org)) {
    const status = subscriptionStatus(org);
    if (status === "past_due" || status === "unpaid") {
      return "Your subscription payment failed. Update your payment method in Billing to restore service.";
    }
    if (status === "canceled") {
      return "Your subscription has ended. Resubscribe at greetq.com/dashboard/billing to go live again.";
    }
    return "Your subscription is not active. Visit Billing to restore service.";
  }

  return trialProductionBlockReason(org);
}

export async function productionBlockReasonAsync(
  admin: SupabaseClient,
  org: BillingOrg
): Promise<string> {
  const base = productionBlockReason(org);
  if (base) return base;

  if (hasPaidAccess(org) && org.id && (await isOverSpendingLimit(admin, org))) {
    const limit = ((org.spending_limit_cents ?? 0) / 100).toFixed(2);
    return `Overage spending limit ($${limit}) reached for this billing period. Calls are paused until you raise the limit or the period resets.`;
  }

  return "";
}

export async function countActiveProductionCalls(
  admin: SupabaseClient,
  orgId: string
): Promise<number> {
  const { count } = await admin
    .from("va_calls")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .eq("is_sandbox", false)
    .is("ended_at", null);

  return count ?? 0;
}

export async function canAcceptNewCall(
  admin: SupabaseClient,
  org: BillingOrg
): Promise<{ allowed: boolean; reason: string }> {
  const blockReason = await productionBlockReasonAsync(admin, org);
  if (blockReason) {
    return { allowed: false, reason: blockReason };
  }

  if (hasPaidAccess(org) && org.id && (await isBillingMigrationApplied())) {
    if (await isOverSpendingLimit(admin, org)) {
      if (!org.overage_blocked) {
        await admin
          .from("va_organizations")
          .update({ overage_blocked: true })
          .eq("id", org.id);
      }
      const limit = ((org.spending_limit_cents ?? 0) / 100).toFixed(2);
      return {
        allowed: false,
        reason: `Overage spending limit ($${limit}) reached for this billing period. Raise the limit in Billing settings or wait for the period to reset.`,
      };
    }
  }

  if (!org.id) return { allowed: true, reason: "" };

  const active = await countActiveProductionCalls(admin, org.id);
  const limit = concurrentCallsForOrg(org);
  if (active >= limit) {
    return {
      allowed: false,
      reason: `Concurrent call limit reached (${limit} on your plan). Try again when a call ends or upgrade your plan.`,
    };
  }

  return { allowed: true, reason: "" };
}

export function canCreateAgent(org: BillingOrg, currentAgentCount: number): boolean {
  if (!hasPaidAccess(org) && isTrialPlan(org)) {
    return currentAgentCount < 1;
  }
  if (!hasPaidAccess(org)) return false;
  return currentAgentCount < maxAgentsForOrg(org);
}

export function agentLimitBlockReason(org: BillingOrg, currentAgentCount: number): string {
  if (!hasPaidAccess(org) && !isTrialPlan(org)) {
    return "Subscribe to create voice agents.";
  }
  const max = hasPaidAccess(org) ? maxAgentsForOrg(org) : 1;
  if (currentAgentCount >= max) {
    return `Your ${org.plan ?? "plan"} plan includes ${max} agent${max === 1 ? "" : "s"}. Upgrade to add more.`;
  }
  return "";
}

export { canMakeSandboxTestCall, sandboxBlockReason };
export { trialCanPurchasePhoneNumber as canPurchasePhoneNumber, phonePurchaseBlockReason };
export { trialMinutesRemaining, isTrialPlan };

/** Compute access_until when Stripe reports past_due. */
export function graceAccessUntil(from = new Date()): string {
  const end = new Date(from);
  end.setUTCDate(end.getUTCDate() + PAYMENT_GRACE_DAYS);
  return end.toISOString();
}
