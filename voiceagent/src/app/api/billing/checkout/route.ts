import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { getPublicAppUrl } from "@/lib/public-url";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { PLANS, type PlanKey } from "@/lib/plans";
import { resolveStripePriceIds } from "@/lib/stripe-prices";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "Create your organization first" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = (body.plan || "starter") as PlanKey;
  const prices = await resolveStripePriceIds();
  const priceId = prices[plan];

  if (!priceId || !priceId.startsWith("price_")) {
    return NextResponse.json(
      {
        error: `No Stripe price found for ${plan}. Create "Intellivo ${PLANS[plan].name}" ($${PLANS[plan].monthlyPrice}/mo) in Stripe, or set STRIPE_PRICE_${plan.toUpperCase()}_MONTHLY.`,
      },
      { status: 400 }
    );
  }

  const appUrl = getPublicAppUrl(request);
  let customerId = org.stripe_customer_id || undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { org_id: org.id, user_id: user.id },
    });
    customerId = customer.id;
    const admin = createAdminClient();
    await admin
      .from("va_organizations")
      .update({ stripe_customer_id: customerId })
      .eq("id", org.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: org.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?success=1`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
    metadata: {
      org_id: org.id,
      plan,
    },
    subscription_data: {
      metadata: {
        org_id: org.id,
        plan,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
