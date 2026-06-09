import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const schema = z.object({
  providerId: z.string().uuid(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  serviceDescription: z.string().min(10),
  scheduledAt: z.string().optional(),
  baseAmountCents: z.number().int().min(0),
  addonsCents: z.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured", demo: true }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });

  try {
    const body = schema.parse(await request.json());
    const platformFee = Math.round(body.baseAmountCents * 0.1);
    const tax = Math.round((body.baseAmountCents + body.addonsCents + platformFee) * 0.12);
    const total = body.baseAmountCents + body.addonsCents + platformFee + tax;

    const admin = createServiceClient();
    let bookingId = `demo-${Date.now()}`;

    if (admin) {
      const { data, error } = await admin
        .from("bookings")
        .insert({
          provider_id: body.providerId,
          customer_name: body.customerName,
          customer_email: body.customerEmail,
          customer_phone: body.customerPhone ?? null,
          service_description: body.serviceDescription,
          scheduled_at: body.scheduledAt ?? null,
          base_amount_cents: body.baseAmountCents,
          addons_cents: body.addonsCents,
          platform_fee_cents: platformFee,
          tax_cents: tax,
          total_cents: total,
          payment_status: "held",
          status: "pending",
        })
        .select("id")
        .single();

      if (!error && data) bookingId = data.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.customerEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: total,
            product_data: {
              name: "ServeLocal Booking",
              description: body.serviceDescription.slice(0, 200),
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/jobs?booked=1`,
      cancel_url: `${appUrl}/booking/${bookingId}?canceled=1`,
      metadata: {
        booking_id: bookingId,
        provider_id: body.providerId,
      },
      payment_intent_data: {
        metadata: {
          booking_id: bookingId,
          escrow: "held_until_complete",
        },
      },
    });

    if (admin && session.id) {
      await admin
        .from("bookings")
        .update({ stripe_session_id: session.id })
        .eq("id", bookingId);
    }

    return NextResponse.json({ url: session.url, bookingId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
