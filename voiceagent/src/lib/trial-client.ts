import { SANDBOX_MAX_TEST_CALLS } from "@/lib/trial";

/** Client-safe trial helpers (no server-only imports). */

export type TrialStatusResponse = {
  onTrial: boolean;
  subscribed: boolean;
  trialMinutesRemaining: number;
  sandboxTestCallsRemaining: number;
};

export async function fetchTrialStatus(): Promise<TrialStatusResponse | null> {
  const res = await fetch("/api/billing/status");
  if (!res.ok) return null;
  const data = await res.json();
  const org = data.org;
  if (!org) return null;

  const subscribed = Boolean(org.stripeSubscriptionId);
  const onTrial = org.plan === "trial" && !subscribed;
  const trialMinutesRemaining = Number(org.trialMinutesRemaining ?? 0);
  const sandboxUsed = Number(org.sandboxTestCallsUsed ?? 0);

  return {
    onTrial,
    subscribed,
    trialMinutesRemaining,
    sandboxTestCallsRemaining: Math.max(0, SANDBOX_MAX_TEST_CALLS - sandboxUsed),
  };
}
