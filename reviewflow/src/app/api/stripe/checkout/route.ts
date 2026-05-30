import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, stripePriceIds } from "@/lib/stripe";

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const prices = stripePriceIds();
    const lineItems: { price: string; quantity: number }[] = [];

    if (prices.monthly) lineItems.push({ price: prices.monthly, quantity: 1 });
    if (prices.setup) lineItems.push({ price: prices.setup, quantity: 1 });

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "Stripe price IDs missing" }, { status: 503 });
    }

    for (const item of lineItems) {
      if (!item.price.startsWith("price_")) {
        return NextResponse.json(
          {
            error:
              "Wrong Stripe ID in .env.local — must be price_..., not prod_.... In Stripe → Product catalog → open product → click the price → copy Price ID. Then run: npm run stop && npm run smooth",
          },
          { status: 400 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email || undefined,
      client_reference_id: business.id,
      line_items: lineItems,
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
