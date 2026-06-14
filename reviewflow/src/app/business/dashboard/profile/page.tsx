import Link from "next/link";

export default function DashboardProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Profile Settings</h1>
      <p className="text-muted">Manage your public business listing</p>
      <div className="card-surface space-y-4 p-6">
        <input placeholder="Business name" className="input-field" />
        <textarea placeholder="Description" className="input-field min-h-[100px]" />
        <input placeholder="Phone" className="input-field" />
        <input placeholder="Website" className="input-field" />
        <button type="button" className="btn-primary-pill px-6 py-2 text-sm">Save changes</button>
      </div>
      <Link href="/dashboard/settings" className="text-sm text-primary hover:underline">
        Legacy settings & QR codes →
      </Link>
    </div>
  );
}
