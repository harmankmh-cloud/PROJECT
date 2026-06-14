"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";

export default function CommunityPage() {
  const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL?.trim();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "community-waitlist" }),
    });
    setLoading(false);
    setDone(true);
  }

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-xl text-center">
          <p className="section-eyebrow mb-3">Community</p>
          <h1 className="font-display text-4xl text-ghost-white">Join the {BRAND.name} community</h1>

          {communityUrl ? (
            <>
              <p className="mt-4 text-on-surface-variant">
                Connect with other operators, share flows, and get product updates.
              </p>
              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8 inline-block px-8 py-3.5"
              >
                Join community
              </a>
            </>
          ) : (
            <>
              <p className="mt-4 text-on-surface-variant">
                Our Discord/Slack community is opening soon. Join the waitlist for an invite.
              </p>
              {done ? (
                <p className="mt-8 text-sm text-success">You&apos;re on the list — we&apos;ll email you.</p>
              ) : (
                <form onSubmit={handleWaitlist} className="mx-auto mt-8 max-w-sm space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full"
                  />
                  <Button type="submit" className="w-full" loading={loading}>
                    Join waitlist
                  </Button>
                </form>
              )}
            </>
          )}

          <p className="mt-10 text-sm text-muted">
            <Link href="/help" className="text-primary-glow hover:underline">
              Contact us
            </Link>{" "}
            for Enterprise community programs.
          </p>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
