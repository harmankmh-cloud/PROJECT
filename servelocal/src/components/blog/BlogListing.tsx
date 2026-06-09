"use client";

import Link from "next/link";
import { useState } from "react";
import { FadeUp } from "@/components/motion/FadeUp";
import { BLOG_POSTS } from "@/lib/site-content";

const TABS = ["All", "DIY", "Hiring Tips", "Cost Guides", "Contractor Spotlight"] as const;

export function BlogListing() {
  const [tab, setTab] = useState<string>("All");

  const posts =
    tab === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) =>
          p.category.toLowerCase().includes(tab.toLowerCase().split(" ")[0] ?? "")
        );

  return (
    <>
      <FadeUp>
        <p className="font-label text-primary">Blog</p>
        <h1 className="font-display mt-2 text-4xl font-black text-foreground">
          Home improvement tips &amp; hiring guides
        </h1>
        <p className="mt-3 text-muted">
          DIY tips, cost guides, and seasonal checklists for Canadian homeowners.
        </p>
      </FadeUp>

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t ? "bg-primary text-white" : "border border-border text-muted hover:border-amber-400/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-10 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="card-glow block rounded-[14px] border border-border bg-surface p-6 transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category}</p>
              <h2 className="font-display mt-1 text-xl font-bold text-foreground">{post.title}</h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted">
                {post.date} · {post.readMinutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-muted">
        Need a pro now?{" "}
        <Link href="/request" className="font-semibold text-primary hover:underline">
          Post a free job
        </Link>
      </p>
    </>
  );
}
