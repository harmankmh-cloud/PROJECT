import { NextResponse } from "next/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { origin } = new URL(request.url);

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (isPlatformAdmin(user.email)) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
