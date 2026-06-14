import { AdminUsersPanel } from "@/components/AdminUsersPanel";

export default function AdminUsersPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <header className="mx-auto mb-6 max-w-4xl">
        <p className="page-eyebrow">ServeLocal admin</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-zinc-900">Users</h1>
        <p className="mt-2 text-sm text-zinc-600">Invite accounts and see who has a pro listing.</p>
      </header>
      <AdminUsersPanel />
    </main>
  );
}
