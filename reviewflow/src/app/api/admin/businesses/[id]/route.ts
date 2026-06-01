import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";
import { createServiceClient } from "@/lib/supabase/admin";
const patchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  businessType: z.string().min(2).max(80).optional(),
  googleReviewUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tone: z.enum(["friendly", "professional", "casual"]).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers, hyphens only")
    .optional(),
  plan: z.enum(["trial", "active", "past_due", "canceled"]).optional(),
  subscriptionStatus: z.string().max(40).optional().nullable(),
});

const deleteSchema = z.object({
  confirmName: z.string().min(2).max(80),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body = patchSchema.parse(await request.json());
    const admin = createServiceClient();
    if (!admin) {
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    const { data: business } = await admin.from("businesses").select("*").eq("id", id).maybeSingle();
    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    const patch: Record<string, string | null> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) patch.name = body.name.trim();
    if (body.businessType !== undefined) patch.business_type = body.businessType.trim();
    if (body.googleReviewUrl !== undefined) {
      patch.google_review_url = body.googleReviewUrl.trim() || null;
    }
    if (body.tone !== undefined) patch.tone = body.tone;
    if (body.plan !== undefined) patch.plan = body.plan;
    if (body.subscriptionStatus !== undefined) {
      patch.subscription_status = body.subscriptionStatus;
    }

    if (body.slug !== undefined) {
      const slug = body.slug.trim();
      const { data: taken } = await admin
        .from("businesses")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .maybeSingle();
      if (taken) {
        return NextResponse.json({ error: "That review link slug is already taken." }, { status: 409 });
      }
      patch.slug = slug;
    }

    const { data: updated, error } = await admin
      .from("businesses")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || "Update failed." }, { status: 500 });
    }

    return NextResponse.json({ business: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body = deleteSchema.parse(await request.json());
    const admin = createServiceClient();
    if (!admin) {
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    const { data: business } = await admin.from("businesses").select("id, name").eq("id", id).maybeSingle();
    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    if (body.confirmName.trim() !== business.name.trim()) {
      return NextResponse.json({ error: "Business name did not match." }, { status: 400 });
    }

    const { error } = await admin.from("businesses").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message || "Delete failed." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Type the business name to confirm delete." }, { status: 400 });
    }
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
