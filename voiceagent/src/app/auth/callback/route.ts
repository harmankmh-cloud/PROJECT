import { NextResponse } from "next/server";
import { ensureUserOrg } from "@/lib/org-setup";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/dashboard";

  const supabase = await createClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      try {
        const { created } = await ensureUserOrg(data.user);
        if (created) {
          const admin = createAdminClient();
          await admin.auth.admin.updateUserById(data.user.id, {
            user_metadata: { ...data.user.user_metadata, onboarding_completed: false },
          });
        }
      } catch {
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent("Account signed in but organization setup failed. Contact support.")}`
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  if (tokenHash && type === "signup") {
    const { error } = await supabase.auth.verifyOtp({ type: "signup", token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}/login?confirmed=1`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Sign-in link expired or invalid. Try again.")}`
  );
}
