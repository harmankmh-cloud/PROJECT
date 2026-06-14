import { createClient } from "@/lib/supabase/client";

export async function markOnboardingPending() {
  const supabase = createClient();
  await supabase.auth.updateUser({ data: { onboarding_completed: false } });
}

export async function markOnboardingComplete() {
  const supabase = createClient();
  await supabase.auth.updateUser({ data: { onboarding_completed: true } });
}

export function needsOnboarding(metadata: Record<string, unknown> | undefined): boolean {
  return metadata?.onboarding_completed === false;
}
