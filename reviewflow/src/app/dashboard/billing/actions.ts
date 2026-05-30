"use server";

import { redirect } from "next/navigation";
import { activateBusinessPlan } from "@/lib/activate-business-plan";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function activateProAction(formData: FormData) {
  if (!isStripeConfigured()) {
    redirect(
      `/dashboard/billing?activation_error=${encodeURIComponent("Stripe is not configured in .env.local")}`
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    redirect(
      `/dashboard/billing?activation_error=${encodeURIComponent("Stripe unavailable")}`
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) {
    redirect(
      `/dashboard/billing?activation_error=${encodeURIComponent("Create your business first")}`
    );
  }

  const sessionId = String(formData.get("sessionId") || "").trim() || undefined;
  const result = await activateBusinessPlan(stripe, business, user.email, sessionId);

  if (result.ok) {
    redirect("/dashboard/billing?activated=1");
  }

  redirect(
    `/dashboard/billing?activation_error=${encodeURIComponent(result.error || "Activation failed")}`
  );
}
