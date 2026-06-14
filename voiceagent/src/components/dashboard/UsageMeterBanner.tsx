import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/trial";
import { PLANS, type PlanKey } from "@/lib/plans";
import {
  billingPeriodStart,
  fetchPeriodUsageEvents,
  summarizeUsageForPlan,
} from "@/lib/usage-metering";
import { isPaymentPastDue, type BillingOrg } from "@/lib/billing-gates";

export async function UsageMeterBanner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const org = await getUserOrg(user.id);
  if (!org || !hasActiveSubscription(org)) return null;

  const billingOrg = org as BillingOrg;
  const planKey = org.plan in PLANS ? (org.plan as PlanKey) : "starter";

  const admin = createAdminClient();
  const events = await fetchPeriodUsageEvents(admin, org.id, billingPeriodStart(billingOrg));
  const { totalMinutes, overageMinutes, percentUsed } = summarizeUsageForPlan(events, planKey);
  const perMinute = PLANS[planKey].perMinute;
  const included = PLANS[planKey].includedMinutes;

  if (isPaymentPastDue(billingOrg)) {
    return (
      <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
        <p className="font-semibold text-ghost-white">Payment failed</p>
        <p className="mt-1">
          Update your payment method in Billing to keep your line active.
        </p>
        <p className="mt-2">
          <Link href="/dashboard/billing" className="font-medium underline hover:opacity-90">
            Fix billing →
          </Link>
        </p>
      </div>
    );
  }

  if (percentUsed < 80) return null;

  const inOverage = overageMinutes > 0;
  const estOverageCost = (overageMinutes * perMinute).toFixed(2);

  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
        inOverage
          ? "border-rose-500/40 bg-rose-500/10 text-rose-50"
          : "border-amber-500/30 bg-amber-500/10 text-amber-50"
      }`}
    >
      {inOverage ? (
        <>
          <p className="font-semibold text-ghost-white">Included minutes used — overage active</p>
          <p className="mt-1">
            {totalMinutes.toLocaleString()} min this period ({included.toLocaleString()} included).
            Extra {overageMinutes.toLocaleString()} min at ${perMinute}/min (~${estOverageCost} est.).
            Calls keep answering — overage bills on your next invoice.
          </p>
        </>
      ) : (
        <>
          <p className="font-semibold text-ghost-white">Approaching included minutes</p>
          <p className="mt-1">
            {totalMinutes.toLocaleString()} of {included.toLocaleString()} included minutes used (
            {percentUsed}%). After that, ${perMinute}/min overage applies — calls are not cut off.
          </p>
        </>
      )}
      <p className="mt-2">
        <Link href="/dashboard/billing" className="font-medium underline hover:opacity-90">
          View billing →
        </Link>
      </p>
    </div>
  );
}
