import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  syncBusinessFromCheckoutSession,
  updateBusinessFromSubscription,
} from "@/lib/stripe-subscription";

export async function POST(request: Request) {
  try {
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

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Create your business first" }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as { sessionId?: string };
    let result: { ok: boolean; error?: string; plan?: string };

    if (body.sessionId) {
      result = await syncBusinessFromCheckoutSession(stripe, business.id, body.sessionId);
    } else if (business.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: business.stripe_customer_id,
        status: "all",
        limit: 1,
      });
      const subscription = subscriptions.data[0];
      if (!subscription) {
        return NextResponse.json({
          updated: false,
          error: "No Stripe subscription found yet. Keep npm run stripe:webhook running and try again.",
        });
      }
      result = await updateBusinessFromSubscription(
        business.id,
        subscription,
        business.stripe_customer_id
      );
    } else if (user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 5 });
      const customer = customers.data.find((row) => row.email === user.email) ?? customers.data[0];

      if (!customer) {
        return NextResponse.json({
          updated: false,
          error:
            "Payment found in Stripe but not linked yet. Run npm run stripe:webhook in a second terminal, then click Activate Pro again.",
        });
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 1,
      });
      const subscription = subscriptions.data[0];

      if (!subscription) {
        return NextResponse.json({
          updated: false,
          error: "No Stripe subscription found yet. Wait a moment and try again.",
        });
      }

      result = await updateBusinessFromSubscription(business.id, subscription, customer.id);
    } else {
      return NextResponse.json({ updated: false, error: "Could not find your Stripe checkout." });
    }

    if (!result.ok) {
      return NextResponse.json({ updated: false, error: result.error || "Sync failed" });
    }

    return NextResponse.json({ updated: true, plan: result.plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ updated: false, error: message }, { status: 500 });
  }
}
