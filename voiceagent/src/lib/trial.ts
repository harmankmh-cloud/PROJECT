/**
 * GreetQ trial model (aligned with Retell / Bland market norms):
 *
 * 1. Explore (no card): text sandbox + capped voice test calls
 * 2. Trial credits: 30 voice minutes on signup for production testing
 * 3. Go live: Stripe subscription with 14-day trial + card on file
 */

export const TRIAL_MINUTES_ON_SIGNUP = 30;
export const STRIPE_TRIAL_DAYS = 14;
export const SANDBOX_MAX_TEST_CALLS = 3;
export const SANDBOX_MAX_SECONDS = 60;

/** Shared marketing copy — keep site and product aligned. */
export const TRIAL_MARKETING = {
  exploreShort: "30 free minutes — no card",
  exploreLong: "30 trial minutes, no card. Go live with a 14-day trial when you're ready.",
  goLiveShort: "14-day trial to go live",
  goLiveLong: "",
  authPanel: "30 trial minutes, no card. Go live with a 14-day trial when you're ready.",
  cta: "Start free — 30 min, no card",
  goLiveCta: "Go live — 14-day trial",
} as const;

export type TrialOrg = {
  plan?: string | null;
  stripe_subscription_id?: string | null;
  trial_minutes_remaining?: number | null;
  sandbox_test_calls_used?: number | null;
  subscription_status?: string | null;
  access_until?: string | null;
};

export function hasActiveSubscription(org: TrialOrg): boolean {
  if (!org.stripe_subscription_id) return false;
  const status = org.subscription_status;
  if (!status) return true;
  if (status === "active" || status === "trialing" || status === "past_due") return true;
  if (status === "canceled" && org.access_until) {
    return new Date(org.access_until).getTime() > Date.now();
  }
  return false;
}

export function isTrialPlan(org: TrialOrg): boolean {
  return (org.plan ?? "trial") === "trial" && !hasActiveSubscription(org);
}

export function trialMinutesRemaining(org: TrialOrg): number {
  return Math.max(0, Number(org.trial_minutes_remaining ?? 0));
}

export function sandboxTestCallsRemaining(org: TrialOrg): number {
  const used = Number(org.sandbox_test_calls_used ?? 0);
  return Math.max(0, SANDBOX_MAX_TEST_CALLS - used);
}

/** Production inbound/outbound/campaign calls (not sandbox). */
export function canMakeProductionCall(org: TrialOrg): boolean {
  if (hasActiveSubscription(org)) return true;
  return trialMinutesRemaining(org) > 0;
}

export function canMakeSandboxTestCall(org: TrialOrg): boolean {
  return sandboxTestCallsRemaining(org) > 0;
}

/** Phone numbers and live routing require a payment method on file. */
export function canPurchasePhoneNumber(org: TrialOrg): boolean {
  return hasActiveSubscription(org);
}

export function productionBlockReason(org: TrialOrg): string {
  if (canMakeProductionCall(org)) return "";
  return "Your free trial minutes are used up. Subscribe with a 14-day trial to go live — card required.";
}

export function sandboxBlockReason(org: TrialOrg): string {
  if (canMakeSandboxTestCall(org)) return "";
  return `You've used all ${SANDBOX_MAX_TEST_CALLS} sandbox test calls. Subscribe to continue testing with live numbers.`;
}

export function phonePurchaseBlockReason(org: TrialOrg): string {
  if (canPurchasePhoneNumber(org)) return "";
  return "Add a payment method and start your 14-day trial before purchasing a phone number.";
}

type TrialAdmin = {
  from: (table: string) => {
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => PromiseLike<unknown>;
    };
  };
};

/** Deduct production minutes from trial credit (no-op when subscribed). */
export async function deductTrialMinutes(
  admin: TrialAdmin,
  orgId: string,
  org: TrialOrg,
  minutes: number
): Promise<void> {
  if (hasActiveSubscription(org) || minutes <= 0) return;

  const remaining = trialMinutesRemaining(org);
  const next = Math.max(0, remaining - minutes);
  await admin
    .from("va_organizations")
    .update({ trial_minutes_remaining: next })
    .eq("id", orgId);
}
