import { NextResponse } from "next/server";
import { z } from "zod";
import { TRADE_CITIES } from "@/lib/tradelocal/constants";
import { createServiceRequest, getServiceCategories } from "@/lib/tradelocal/data";

const citySlugs = TRADE_CITIES.map((c) => c.slug);

const bodySchema = z.object({
  categorySlug: z.string().min(2),
  citySlug: z.enum(citySlugs as [string, ...string[]]),
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(10).max(20),
  customerEmail: z.union([z.string().email(), z.literal("")]).optional(),
  description: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const categories = await getServiceCategories();
    if (!categories.some((c) => c.slug === body.categorySlug)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const result = await createServiceRequest({
      categorySlug: body.categorySlug,
      citySlug: body.citySlug,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      description: body.description,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Request posted — local pros can contact you directly.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Check your form fields" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
