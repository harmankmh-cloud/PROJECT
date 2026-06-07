import { NextResponse } from "next/server";
import { z } from "zod";
import { getProvidersForUser } from "@/lib/data";
import { getStripe, isStripeConfigured, stripePriceForPlan } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  plan: z.enum(["featured", "premium"]),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured — use contact form" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const { plan } = bodySchema.parse(await request.json());
    const priceId = stripePriceForPlan(plan);
    if (!priceId?.startsWith("price_")) {
      return NextResponse.json(
        { error: `Missing STRIPE_PRICE_${plan.toUpperCase()} (must be price_...)` },
        { status: 503 }
      );
    }

    const listings = await getProvidersForUser(user.id, user.email ?? undefined);
    const listing = listings.find((l) => l.status === "approved") || listings[0];
    if (!listing) {
      return NextResponse.json({ error: "Apply for a listing first at /join" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email || undefined,
      client_reference_id: listing.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/pro?upgraded=1`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      metadata: {
        provider_id: listing.id,
        plan,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          provider_id: listing.id,
          plan,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
