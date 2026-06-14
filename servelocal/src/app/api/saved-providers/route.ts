import { NextResponse } from "next/server";
import { z } from "zod";
import { getSavedProviders, toggleSavedProvider } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ saved: [] });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const saved = await getSavedProviders(user.id);
  return NextResponse.json({ saved });
}

const postSchema = z.object({
  providerId: z.string().uuid(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const { providerId } = postSchema.parse(await request.json());
    const result = await toggleSavedProvider(user.id, providerId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ saved: result.saved });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
