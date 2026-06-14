import { HomeownerSettingsForm } from "@/components/homeowner/HomeownerSettingsForm";
import { DataPrivacyActions } from "@/components/homeowner/DataPrivacyActions";
import { getUserProfile } from "@/lib/user-profiles";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const profile = user ? await getUserProfile(user.id) : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">Account and notification preferences.</p>

      {user ? (
        <HomeownerSettingsForm
          email={user.email ?? ""}
          displayName={profile?.display_name ?? ""}
          phone={profile?.phone ?? ""}
        />
      ) : null}

      <DataPrivacyActions />
    </div>
  );
}
