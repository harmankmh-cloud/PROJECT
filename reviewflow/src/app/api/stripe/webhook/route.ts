import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, stripePriceIds } from "@/lib/stripe";
import { BRAND } from "@/lib/brand";
import {
  setCallLocalSubscribed,
  subscriptionHasActiveCallLocal,
  updateBusinessFromSubscription,
} from "@/lib/stripe-subscription";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: `${BRAND.name} Stripe webhook. Stripe sends POST requests here — do not open in a browser.`,
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const calllocalPriceId = stripePriceIds().calllocal;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.metadata?.business_id || session.client_reference_id;
      const isAddonOnly = session.metadata?.addon === "calllocal";

      if (businessId && session.customer && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));

        if (isAddonOnly) {
          // Standalone CallLocal add-on purchase: only toggle the entitlement,
          // do not touch the Pro plan / subscription fields.
          const subscribed = subscriptionHasActiveCallLocal(subscription, calllocalPriceId);
          const result = await setCallLocalSubscribed(businessId, subscribed);
          if (!result.ok) {
            console.error("[stripe webhook] calllocal checkout:", result.error);
            return NextResponse.json({ error: result.error }, { status: 500 });
          }
        } else {
          const result = await updateBusinessFromSubscription(
            businessId,
            subscription,
            String(session.customer)
          );
          if (!result.ok) {
            console.error("[stripe webhook] checkout.session.completed:", result.error);
            return NextResponse.json({ error: result.error }, { status: 500 });
          }
          // Reconcile add-on entitlement if it was bundled into the Pro checkout.
          await setCallLocalSubscribed(
            businessId,
            subscriptionHasActiveCallLocal(subscription, calllocalPriceId)
          );
        }
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const businessId = subscription.metadata?.business_id;
      const customerId = String(subscription.customer);
      const isAddonOnly = subscription.metadata?.addon === "calllocal";

      if (businessId) {
        const calllocalActive =
          event.type === "customer.subscription.deleted"
            ? false
            : subscriptionHasActiveCallLocal(subscription, calllocalPriceId);

        if (isAddonOnly) {
          // Standalone add-on subscription changed: only update the entitlement.
          const result = await setCallLocalSubscribed(businessId, calllocalActive);
          if (!result.ok) {
            console.error("[stripe webhook] calllocal subscription event:", result.error);
            return NextResponse.json({ error: result.error }, { status: 500 });
          }
        } else {
          const result = await updateBusinessFromSubscription(
            businessId,
            subscription,
            customerId
          );
          if (!result.ok) {
            console.error("[stripe webhook] subscription event:", result.error);
            return NextResponse.json({ error: result.error }, { status: 500 });
          }
          // Keep add-on entitlement in sync when items change on the Pro sub.
          await setCallLocalSubscribed(businessId, calllocalActive);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("[stripe webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
