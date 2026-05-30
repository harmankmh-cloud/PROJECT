import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { activateBusinessPlan } from "@/lib/activate-business-plan";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/dashboard/billing", request.url));
}

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
    const result = await activateBusinessPlan(
      stripe,
      business,
      user.email,
      body.sessionId
    );

    if (!result.ok) {
      return NextResponse.json({ updated: false, error: result.error || "Sync failed" });
    }

    return NextResponse.json({ updated: true, plan: result.plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ updated: false, error: message }, { status: 500 });
  }
}
