import { NextResponse } from "next/server";
import { z } from "zod";
import { updateBookingQuoteAction } from "@/lib/data/bookings";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const { action } = z.object({ action: z.enum(["accept", "decline"]) }).parse(await request.json());
    const result = await updateBookingQuoteAction(id, user.id, user.email ?? undefined, action);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
