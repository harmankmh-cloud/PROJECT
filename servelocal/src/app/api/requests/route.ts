import { NextResponse } from "next/server";
import { z } from "zod";
import { TRADE_CITIES } from "@/lib/constants";
import { normalizePhone, zodFieldError } from "@/lib/form-utils";
import { createServiceRequest, getServiceCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const citySlugs = TRADE_CITIES.map((c) => c.slug);

const bodySchema = z.object({
  categorySlug: z.string().min(2),
  citySlug: z.enum(citySlugs as [string, ...string[]]),
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().transform(normalizePhone).pipe(z.string().length(10)),
  customerEmail: z.union([z.string().email(), z.literal("")]).optional(),
  description: z.string().min(10).max(2000),
  urgency: z.enum(["asap", "this_week", "this_month", "flexible"]).optional(),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const categories = await getServiceCategories();
    if (!categories.some((c) => c.slug === body.categorySlug)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    const result = await createServiceRequest({
      categorySlug: body.categorySlug,
      citySlug: body.citySlug,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || user?.email || undefined,
      description: body.description,
      userId: user?.id,
      urgency: body.urgency,
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const email = body.customerEmail || user?.email;
    if (email) {
      const categoryName = categories.find((c) => c.slug === body.categorySlug)?.name || body.categorySlug;
      const { jobPostedEmail } = await import("@/lib/email-templates");
      const { sendTransactionalEmail } = await import("@/lib/email");
      const { subject, html } = jobPostedEmail({
        customerName: body.customerName,
        categoryName,
        citySlug: body.citySlug,
        matchCount: result.matches?.length ?? 0,
      });
      await sendTransactionalEmail({ to: email, subject, html, template: "job_posted" });
    }

    return NextResponse.json({
      ok: true,
      message: "Request posted — call matching pros below.",
      matches: result.matches,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: zodFieldError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
