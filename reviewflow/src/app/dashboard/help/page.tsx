import { redirect } from "next/navigation";
import { SupportForm } from "@/components/SupportForm";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardHelpPage() {
  const { user, business } = await getDashboardData();

  if (!user) redirect("/login");

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Support</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Help & suggestions</h1>
          <p className="mt-2 text-sm text-stone-500">
            Message the {business?.name ? `${business.name} ` : ""}RateLocal team — we reply by email.
          </p>
        </header>

        <SupportForm
          defaultEmail={user.email || ""}
          defaultBusinessName={business?.name || ""}
        />

        <div className="surface-card p-5 text-sm text-slate-600">
          <p className="font-semibold text-brand-950">Quick tips</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Google link missing? Use the popup on Home or Settings.</li>
            <li>QR not working? Check Share kit and use your live link, not localhost.</li>
            <li>Billing questions? Open My plan or pick Billing above.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
