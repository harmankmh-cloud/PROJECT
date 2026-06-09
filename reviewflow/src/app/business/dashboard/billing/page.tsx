import Link from "next/link";

export default function DashboardBillingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Billing</h1>
      <div className="card-surface p-6">
        <p className="text-sm text-muted">Current plan</p>
        <p className="font-display text-2xl font-bold text-text">Pro — $49/mo</p>
        <Link href="/pricing" className="btn-ghost mt-4 inline-block text-sm">View plans</Link>
      </div>
      <Link href="/dashboard/billing" className="text-sm text-primary hover:underline">
        Manage Stripe billing →
      </Link>
    </div>
  );
}
