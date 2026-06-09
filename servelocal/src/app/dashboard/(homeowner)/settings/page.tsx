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
      <h1 className="font-display text-2xl font-black text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Account and notification preferences.</p>

      <div className="mt-8 max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <p className="font-label text-slate-500">Email</p>
          <p className="mt-1 text-slate-900">{user?.email}</p>
        </div>
        <div>
          <p className="font-label text-slate-500">Display name</p>
          <p className="mt-1 text-slate-900">{profile?.display_name ?? "—"}</p>
        </div>
        <div>
          <p className="font-label text-slate-500">Account type</p>
          <p className="mt-1 capitalize text-slate-900">{profile?.role ?? "homeowner"}</p>
        </div>
      </div>
    </div>
  );
}
