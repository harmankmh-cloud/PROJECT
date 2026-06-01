import Link from "next/link";
import { getPlatformMessages } from "@/lib/admin-data";

export default async function AdminMessagesPage() {
  const messages = await getPlatformMessages(100);
  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Messages from users</h1>
          <p className="mt-2 text-sm text-stone-500">
            Help & suggestions from {messages.length} message{messages.length === 1 ? "" : "s"}
            {unread > 0 ? ` · ${unread} new` : ""}
          </p>
        </header>

        {messages.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <p className="text-sm text-slate-500">No messages yet.</p>
            <p className="mt-2 text-xs text-slate-400">
              Run <code className="rounded bg-cream px-1">supabase/platform_messages.sql</code> in
              Supabase if the inbox is not set up.
            </p>
            <Link href="/help" className="btn-ghost mt-4 inline-flex px-4 py-2 text-sm">
              Open public help page →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((row) => (
              <article
                key={row.id}
                className={`surface-card p-6 ${row.status === "new" ? "ring-2 ring-gold-400/40" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand-950">
                      {row.name || "No name"}{" "}
                      <span className="font-normal text-slate-500">&lt;{row.email}&gt;</span>
                    </p>
                    {row.business_name && (
                      <p className="text-sm text-slate-500">{row.business_name}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold capitalize text-brand-950">
                      {row.category}
                    </span>
                    <p className="mt-1 text-slate-400">{new Date(row.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {row.message}
                </p>
                <a
                  href={`mailto:${row.email}?subject=Re: RateLocal ${row.category}`}
                  className="btn-ghost mt-4 inline-flex px-4 py-2 text-sm"
                >
                  Reply by email →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
