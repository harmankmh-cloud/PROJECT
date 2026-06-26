import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/app-url-server";
import { getStripe, isStripeConfigured, stripePriceIds } from "@/lib/stripe";
import { setCallLocalSubscribed } from "@/lib/stripe-subscription";

/**
 * Self-serve subscribe to the CallLocal $10/mo add-on.
 *
 * - If the business already has an active Stripe subscription, the add-on price
 *   is added as a line item on that subscription (single invoice, prorated).
 * - Otherwise a standalone Checkout session is created for the add-on.
 */
export async function POST() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add keys to .env.local." },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
    }

    const prices = stripePriceIds();
    if (!prices.calllocal || !prices.calllocal.startsWith("price_")) {
      return NextResponse.json(
        { error: "CallLocal add-on price is not configured (STRIPE_PRICE_CALLLOCAL)." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id, stripe_customer_id, stripe_subscription_id, subscription_status, calllocal_subscribed")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Create your business first" }, { status: 404 });
    }

    if (business.calllocal_subscribed) {
      return NextResponse.json({ alreadySubscribed: true });
    }

    const appUrl = await getAppUrl();

    // Path 1: add the add-on to an existing active subscription.
    const hasActiveSub =
      business.stripe_subscription_id &&
      (business.subscription_status === "active" || business.subscription_status === "trialing");

    if (hasActiveSub) {
      const subscription = await stripe.subscriptions.retrieve(business.stripe_subscription_id);
      const already = subscription.items.data.some((item) => item.price?.id === prices.calllocal);

      if (!already) {
        await stripe.subscriptionItems.create({
          subscription: subscription.id,
          price: prices.calllocal,
          quantity: 1,
        });
      }

      const result = await setCallLocalSubscribed(business.id, true);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ added: true });
    }

    // Path 2: standalone Checkout session for the add-on.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: business.stripe_customer_id || undefined,
      customer_email: business.stripe_customer_id ? undefined : user.email || undefined,
      client_reference_id: business.id,
      payment_method_types: ["card"],
      line_items: [{ price: prices.calllocal, quantity: 1 }],
      success_url: `${appUrl}/dashboard/calls?addon=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/calls?addon=canceled`,
      metadata: {
        business_id: business.id,
        user_id: user.id,
        addon: "calllocal",
      },
      subscription_data: {
        metadata: {
          business_id: business.id,
          addon: "calllocal",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start CallLocal checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
