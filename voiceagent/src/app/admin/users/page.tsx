import { AdminUsersPanel } from "@/components/AdminUsersPanel";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="page-eyebrow">Platform panel</p>
        <h1 className="font-display mt-1 text-3xl text-ghost-white">Users</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Invite GreetQ customers by email and see their organizations.
        </p>
      </header>
      <AdminUsersPanel />
    </div>
  );
}
