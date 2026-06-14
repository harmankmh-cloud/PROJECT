import { NextResponse } from "next/server";
import { z } from "zod";
import { createSavedSearch, deleteSavedSearch, getUserSavedSearches } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  label: z.string().min(2).max(80),
  query: z.string().max(120).optional(),
  citySlug: z.string().max(40).optional(),
  categorySlug: z.string().max(40).optional(),
  licensedOnly: z.boolean().optional(),
  verifiedOnly: z.boolean().optional(),
  emergencyOnly: z.boolean().optional(),
});

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const searches = await getUserSavedSearches(user.id);
  return NextResponse.json({ searches });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const body = createSchema.parse(await request.json());
    const result = await createSavedSearch({
      userId: user.id,
      email: user.email,
      label: body.label,
      query: body.query,
      citySlug: body.citySlug,
      categorySlug: body.categorySlug,
      licensedOnly: body.licensedOnly,
      verifiedOnly: body.verifiedOnly,
      emergencyOnly: body.emergencyOnly,
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const result = await deleteSavedSearch(user.id, id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
