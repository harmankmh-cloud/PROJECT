import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const schema = z.object({
  providerId: z.string().uuid(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  serviceDescription: z.string().min(10),
  scheduledAt: z.string().optional(),
  baseAmountCents: z.number().int().min(0).default(10000),
  addonsCents: z.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = schema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    const platformFee = Math.round(body.baseAmountCents * 0.1);
    const tax = Math.round((body.baseAmountCents + body.addonsCents + platformFee) * 0.12);
    const total = body.baseAmountCents + body.addonsCents + platformFee + tax;

    const admin = createServiceClient();
    if (!admin) {
      const platformFee = Math.round(body.baseAmountCents * 0.1);
      const tax = Math.round((body.baseAmountCents + body.addonsCents + platformFee) * 0.12);
      const total = body.baseAmountCents + body.addonsCents + platformFee + tax;
      return NextResponse.json({ id: `demo-${Date.now()}`, totalCents: total, demo: true });
    }
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
        status: "confirmed",
        user_id: user?.id ?? null,
      })
      .select("id")
      .single();

    if (error) {
      // Table may not exist yet — return mock ID for UI demo
      if (error.code === "42P01") {
        return NextResponse.json({
          id: `demo-${Date.now()}`,
          totalCents: total,
          demo: true,
        });
      }
      throw error;
    }

    return NextResponse.json({ id: data.id, totalCents: total });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
