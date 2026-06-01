import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/app-url-server";
import { validateCheckoutPrices } from "@/lib/stripe-prices";
import { getStripe, isStripeConfigured, stripePriceIds } from "@/lib/stripe";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/dashboard/billing", request.url));
}

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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Create your business first" }, { status: 404 });
    }

    const appUrl = await getAppUrl();
    const prices = stripePriceIds();

    if (!prices.monthly || !prices.setup) {
      return NextResponse.json({ error: "Stripe price IDs missing in server env" }, { status: 503 });
    }

    for (const [label, priceId] of [
      ["STRIPE_PRICE_MONTHLY", prices.monthly],
      ["STRIPE_PRICE_SETUP", prices.setup],
    ] as const) {
      if (!priceId.startsWith("price_")) {
        return NextResponse.json(
          {
            error: `${label} must be price_..., not prod_.... In Stripe → Product catalog → open product → click the price → copy Price ID.`,
          },
          { status: 400 }
        );
      }
    }

    const priceCheck = await validateCheckoutPrices(stripe, prices.setup, prices.monthly);
    if (!priceCheck.ok) {
      return NextResponse.json({ error: priceCheck.errors.join(" ") }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email || undefined,
      client_reference_id: business.id,
      payment_method_types: ["card"],
      line_items: [
        { price: prices.monthly, quantity: 1 },
        { price: prices.setup, quantity: 1 },
      ],
      success_url: `${appUrl}/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
      metadata: {
        business_id: business.id,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          business_id: business.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    let message = error instanceof Error ? error.message : "Checkout failed";
    if (message.includes("No such price") && message.includes("prod_")) {
      message =
        "The app is still using a Product ID (prod_...) instead of a Price ID (price_...). Fix .env.local, then fully restart: npm run stop && npm run smooth";
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
