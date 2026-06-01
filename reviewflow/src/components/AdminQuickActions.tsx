"use client";

import { useState } from "react";
import Link from "next/link";
import { copyToClipboard } from "@/lib/copy";

type Props = {
  appUrl: string;
};

export function AdminQuickActions({ appUrl }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(key: string, text: string) {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="surface-card p-6">
      <h2 className="font-semibold text-brand-950">Quick controls</h2>
      <p className="mt-1 text-sm text-slate-500">Copy links, open tools, share RateLocal.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => copy("signup", `${appUrl}/signup`)}
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-left transition hover:border-mint-400/40 hover:shadow-md"
        >
          <p className="font-semibold text-brand-950">
            {copied === "signup" ? "Signup link copied!" : "Copy signup link"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Share with new business owners</p>
        </button>
        <button
          type="button"
          onClick={() => copy("home", appUrl)}
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-left transition hover:border-mint-400/40 hover:shadow-md"
        >
          <p className="font-semibold text-brand-950">
            {copied === "home" ? "Homepage copied!" : "Copy homepage link"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Marketing & social posts</p>
        </button>
        <Link
          href="/admin/businesses"
          className="rounded-2xl border border-teal-400/30 bg-teal-50/50 p-4 transition hover:border-teal-400/50 hover:shadow-md"
        >
          <p className="font-semibold text-brand-950">Add / fix businesses</p>
          <p className="mt-1 text-xs text-slate-500">Create, edit, or remove customer accounts</p>
        </Link>
        <a
          href="https://dashboard.stripe.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition hover:border-mint-400/40 hover:shadow-md"
        >
          <p className="font-semibold text-brand-950">Open Stripe →</p>
          <p className="mt-1 text-xs text-slate-500">Revenue, payments, subscriptions</p>
        </a>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition hover:border-mint-400/40 hover:shadow-md"
        >
          <p className="font-semibold text-brand-950">Open Supabase →</p>
          <p className="mt-1 text-xs text-slate-500">Users, auth emails, database</p>
        </a>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/admin/reviews" className="btn-ghost px-4 py-2 text-sm">
          All reviews
        </Link>
        <Link href="/admin/revenue" className="btn-ghost px-4 py-2 text-sm">
          Revenue
        </Link>
        <Link href="/admin/activity" className="btn-ghost px-4 py-2 text-sm">
          Activity
        </Link>
        <Link href="/admin/messages" className="btn-ghost px-4 py-2 text-sm">
          User messages
        </Link>
        <a href="/api/admin/export/businesses" className="btn-dark px-4 py-2 text-sm">
          Export businesses CSV
        </a>
      </div>
    </div>
  );
}
