import { NextResponse } from "next/server";
import { z } from "zod";
import { TRADE_CITIES } from "@/lib/constants";
import { normalizePhone, zodFieldError } from "@/lib/form-utils";
import { createProviderApplication, getServiceCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const citySlugs = TRADE_CITIES.map((c) => c.slug);

const bodySchema = z.object({
  displayName: z.string().min(2).max(80),
  categorySlug: z.string().min(2),
  citySlug: z.enum(citySlugs as [string, ...string[]]),
  phone: z.string().transform(normalizePhone).pipe(z.string().length(10)),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  whatsapp: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  licensed: z.boolean().optional(),
  licenseNumber: z.string().max(40).optional(),
  website: z.string().max(200).optional(),
  minCalloutFee: z.string().max(40).optional(),
  businessHours: z.string().max(120).optional(),
  emergencyAvailable: z.boolean().optional(),
  requestedPlan: z.enum(["free", "featured", "premium"]).optional(),
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

    const result = await createProviderApplication({
      displayName: body.displayName,
      categorySlug: body.categorySlug,
      citySlug: body.citySlug,
      phone: body.phone,
      email: body.email,
      whatsapp: body.whatsapp,
      bio: body.bio,
      yearsExperience: body.yearsExperience,
      licensed: body.licensed,
      licenseNumber: body.licenseNumber,
      website: body.website,
      minCalloutFee: body.minCalloutFee,
      businessHours: body.businessHours,
      emergencyAvailable: body.emergencyAvailable,
      requestedPlan: body.requestedPlan,
      ownerUserId: user?.id,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Application received — we review within 1–2 days." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: zodFieldError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
