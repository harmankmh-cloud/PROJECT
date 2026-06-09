import { NextResponse } from "next/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user-profiles";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const { origin } = new URL(request.url);

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (isPlatformAdmin(user.email)) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  const profile = await getUserProfile(user.id);
  const role = profile?.role ?? (user.user_metadata?.role as string | undefined);

  if (role === "pro") {
    const listings = await getProvidersForUser(user.id, user.email ?? undefined);
    if (listings.length === 0) {
      return NextResponse.redirect(`${origin}/onboarding`);
    }
    return NextResponse.redirect(`${origin}/dashboard/pro`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
