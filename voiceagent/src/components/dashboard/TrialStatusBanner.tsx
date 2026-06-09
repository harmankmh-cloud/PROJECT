import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import {
  hasActiveSubscription,
  isTrialPlan,
  sandboxTestCallsRemaining,
  STRIPE_TRIAL_DAYS,
  trialMinutesRemaining,
  TRIAL_MINUTES_ON_SIGNUP,
} from "@/lib/trial";

export async function TrialStatusBanner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const org = await getUserOrg(user.id);
  if (!org) return null;

  if (hasActiveSubscription(org) || !isTrialPlan(org)) return null;

  const minutesLeft = trialMinutesRemaining(org);
  const sandboxLeft = sandboxTestCallsRemaining(org);

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
      <p>
        <span className="font-semibold text-ghost-white">Free explore mode</span> —{" "}
        {minutesLeft} of {TRIAL_MINUTES_ON_SIGNUP} trial minutes left
        {sandboxLeft > 0 ? ` · ${sandboxLeft} sandbox test call${sandboxLeft === 1 ? "" : "s"} left` : ""}.
        Text sandbox is always free.
      </p>
      <p className="mt-2 text-amber-100/90">
        Ready for a live number?{" "}
        <Link href="/dashboard/billing" className="font-medium text-teal-300 underline hover:text-teal-200">
          Go live — {STRIPE_TRIAL_DAYS}-day trial, card required
        </Link>
      </p>
    </div>
  );
}
