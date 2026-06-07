import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { updateProviderFromSubscription } from "@/lib/stripe-subscription";
import { notifyProUpgradeEmails } from "@/lib/stripe-notify";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "ServeLocal Stripe webhook — Stripe sends POST here.",
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

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
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const providerId = session.metadata?.provider_id || session.client_reference_id;
      const plan = session.metadata?.plan;

      if (providerId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
        const result = await updateProviderFromSubscription(providerId, subscription, plan);
        if (!result.ok) {
          console.error("[servelocal stripe] checkout.session.completed:", result.error);
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
        await notifyProUpgradeEmails(providerId, plan);
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const providerId = subscription.metadata?.provider_id;

      if (providerId) {
        const result = await updateProviderFromSubscription(
          providerId,
          subscription,
          subscription.metadata?.plan
        );
        if (!result.ok) {
          console.error("[servelocal stripe] subscription event:", result.error);
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("[servelocal stripe]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
