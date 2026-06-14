import type Stripe from "stripe";
import { BRAND } from "@/lib/brand";

export async function ensureBillingPortalConfiguration(stripe: Stripe) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || `https://${BRAND.domain}`;
  const existing = await stripe.billingPortal.configurations.list({ limit: 10 });
  const active = existing.data.find((config) => config.active);
  if (active) return active;

  return stripe.billingPortal.configurations.create({
    default_return_url: `${appUrl}/dashboard/billing`,
    business_profile: {
      headline: `Manage your ${BRAND.proPlan} subscription`,
      privacy_policy_url: `${appUrl}/privacy`,
      terms_of_service_url: `${appUrl}/terms`,
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ["email"],
      },
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
        },
      },
      subscription_update: { enabled: false },
    },
  });
}
