import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";
import { BRAND } from "@/lib/brand";
import type { PlanKey } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create your ${BRAND.name} account — 30 free minutes and sandbox testing, no card required. Go live with a 14-day trial when you're ready.`,
  alternates: { canonical: "/signup" },
};

function parsePlan(plan?: string): PlanKey | null {
  if (plan === "starter" || plan === "growth" || plan === "pro" || plan === "enterprise") return plan;
  return null;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  return <SignupForm initialPlan={parsePlan(params.plan)} />;
}
