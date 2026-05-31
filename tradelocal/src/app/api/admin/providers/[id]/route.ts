import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePlatformAdminApi } from "@/lib/require-admin";
import { updateProviderAdmin } from "@/lib/data";

const patchSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "paused"]).optional(),
  featured: z.boolean().optional(),
  displayName: z.string().min(2).max(80).optional(),
  phone: z.string().min(10).max(20).optional(),
  bio: z.string().max(1000).optional(),
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
    const patch: Record<string, unknown> = {};
    if (body.status !== undefined) patch.status = body.status;
    if (body.featured !== undefined) patch.featured = body.featured;
    if (body.displayName !== undefined) patch.display_name = body.displayName;
    if (body.phone !== undefined) patch.phone = body.phone;
    if (body.bio !== undefined) patch.bio = body.bio;

    const result = await updateProviderAdmin(id, patch as Parameters<typeof updateProviderAdmin>[1]);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
