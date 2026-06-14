import { OutreachPanel } from "@/components/OutreachPanel";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminOutreachPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/login");

  return (
    <div className="space-y-6">
      <header>
        <p className="page-eyebrow">Sales</p>
        <h1 className="font-display mt-1 text-3xl text-ghost-white">GreetQ outreach</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Cold email for BC businesses — generate, preview to your inbox, then send. Replaces Make.com for
          manual outreach.
        </p>
      </header>
      <OutreachPanel adminEmail={user.email} />
    </div>
  );
}
