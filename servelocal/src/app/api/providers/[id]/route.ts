import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone, zodFieldError } from "@/lib/form-utils";
import { updateProviderOwner } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  displayName: z.string().min(2).max(80).optional(),
  phone: z.string().transform(normalizePhone).pipe(z.string().length(10)).optional(),
  whatsapp: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  licenseNumber: z.string().max(40).optional(),
  website: z.string().max(200).optional(),
  minCalloutFee: z.string().max(40).optional(),
  businessHours: z.string().max(120).optional(),
  emergencyAvailable: z.boolean().optional(),
  portfolioUrls: z.array(z.string().url()).max(10).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = patchSchema.parse(await request.json());

    const supabase = await createClient();
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patch: Parameters<typeof updateProviderOwner>[2] = {};
    if (body.displayName !== undefined) patch.display_name = body.displayName;
    if (body.phone !== undefined) patch.phone = body.phone;
    if (body.whatsapp !== undefined) patch.whatsapp = body.whatsapp;
    if (body.bio !== undefined) patch.bio = body.bio;
    if (body.yearsExperience !== undefined) patch.years_experience = body.yearsExperience;
    if (body.licenseNumber !== undefined) patch.license_number = body.licenseNumber;
    if (body.website !== undefined) patch.website = body.website;
    if (body.minCalloutFee !== undefined) patch.min_callout_fee = body.minCalloutFee;
    if (body.businessHours !== undefined) patch.business_hours = body.businessHours;
    if (body.emergencyAvailable !== undefined) patch.emergency_available = body.emergencyAvailable;

    if (body.portfolioUrls !== undefined) {
      const { data: row } = await (supabase
        ? supabase.from("service_providers").select("listing_tier, featured").eq("id", id).maybeSingle()
        : { data: null });
      const tier = (row as { listing_tier?: string; featured?: boolean } | null)?.listing_tier;
      const featured = (row as { featured?: boolean } | null)?.featured;
      const { portfolioLimitForTier } = await import("@/lib/plan-benefits");
      const { isFeaturedTier } = await import("@/lib/schemas/db/normalize");
      const limit = isFeaturedTier(tier) || featured ? portfolioLimitForTier(tier as "free" | "featured" | "premium") : 0;
      if (limit === 0 && body.portfolioUrls.length > 0) {
        return NextResponse.json(
          { error: "Upgrade to Featured to add portfolio photos" },
          { status: 403 }
        );
      }
      patch.portfolio_urls = body.portfolioUrls.slice(0, limit);
    }

    const result = await updateProviderOwner(id, user.id, patch);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Not authorized" ? 403 : 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: zodFieldError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
}
