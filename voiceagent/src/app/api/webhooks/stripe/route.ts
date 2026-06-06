import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { reportVoiceMinutes } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const customerId = subscription.customer as string;

    const plan = subscription.items.data[0]?.price?.lookup_key || "starter";
    await admin
      .from("va_organizations")
      .update({
        stripe_subscription_id: subscription.id,
        plan: plan.includes("enterprise") ? "enterprise" : plan.includes("pro") ? "pro" : "starter",
      })
      .eq("stripe_customer_id", customerId);
  }

  if (event.type === "invoice.created") {
    const { data: pending } = await admin
      .from("va_usage_events")
      .select("org_id, quantity, va_organizations(stripe_customer_id)")
      .eq("reported_to_stripe", false)
      .limit(100);

    for (const event of pending || []) {
      const org = event.va_organizations as { stripe_customer_id: string } | { stripe_customer_id: string }[] | null;
      const customerId = Array.isArray(org) ? org[0]?.stripe_customer_id : org?.stripe_customer_id;
      if (customerId) {
        await reportVoiceMinutes(customerId, Number(event.quantity));
      }
    }

    if (pending?.length) {
      await admin
        .from("va_usage_events")
        .update({ reported_to_stripe: true })
        .eq("reported_to_stripe", false);
    }
  }

  return NextResponse.json({ received: true });
}
