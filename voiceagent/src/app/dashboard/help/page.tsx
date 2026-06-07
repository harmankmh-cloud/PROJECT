import { redirect } from "next/navigation";
import { SupportForm } from "@/components/SupportForm";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { BRAND } from "@/lib/brand";

export default async function DashboardHelpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const org = await getUserOrg(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <p className="page-eyebrow">Support</p>
        <h1 className="font-display mt-1 text-3xl text-brand-900">Help & suggestions</h1>
        <p className="mt-2 text-sm text-slate-500">
          Message the {BRAND.name} team — your request is saved to our support queue.
        </p>
      </header>

      <SupportForm defaultEmail={user.email || ""} defaultOrgName={org?.name || ""} />

      <div className="surface-card p-5 text-sm text-slate-600">
        <p className="font-semibold text-brand-900">Quick tips</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Calls not routing? Check Phone Numbers and your Twilio/Telnyx webhook URL.</li>
          <li>Agent giving wrong answers? Add knowledge docs and enable knowledge on the agent.</li>
          <li>Billing questions? Open Billing or manage your subscription in Stripe.</li>
        </ul>
      </div>
    </div>
  );
}
