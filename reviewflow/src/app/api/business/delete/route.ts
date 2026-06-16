import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  confirmName: z.string().min(2).max(80),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "No business found." }, { status: 404 });
    }

    if (body.confirmName.trim() !== business.name.trim()) {
      return NextResponse.json(
        { error: "Business name did not match. Type the exact name to confirm." },
        { status: 400 }
      );
    }

    if (business.stripe_subscription_id && isStripeConfigured()) {
      const stripe = getStripe();
      if (stripe) {
        try {
          await stripe.subscriptions.cancel(business.stripe_subscription_id);
        } catch (err) {
          console.error("[business/delete] Stripe cancel failed:", err);
          return NextResponse.json(
            { error: "Could not cancel subscription. Try billing portal or contact support." },
            { status: 502 }
          );
        }
      }
    }

    const { error } = await supabase.from("businesses").delete().eq("id", business.id);

    if (error) {
      return NextResponse.json({ error: error.message || "Could not delete business." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      hadSubscription: !!business.stripe_subscription_id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not delete business." }, { status: 500 });
  }
}
