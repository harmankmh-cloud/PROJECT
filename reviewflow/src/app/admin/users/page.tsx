import { AdminUsersPanel } from "@/components/AdminUsersPanel";

export default function AdminUsersPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Platform panel</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Users</h1>
          <p className="mt-2 text-sm text-stone-500">
            Invite business owners by email, then provision their shop under All businesses.
          </p>
        </header>
        <AdminUsersPanel />
      </div>
    </main>
  );
}
