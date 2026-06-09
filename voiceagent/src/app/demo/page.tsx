"use client";

import Link from "next/link";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardShell } from "@/components/DashboardShell";
import { PageTransition } from "@/components/ui/PageTransition";
import { useUiStore } from "@/stores/ui";

export default function DemoPage() {
  const bannerVisible = useUiStore((s) => s.demoBannerVisible);

  return (
    <PageTransition>
      <DashboardShell orgName="Your Business" isDemo>
        {bannerVisible && (
          <div className="border-b border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm text-text">
            This is a live demo — your real dashboard looks like this
          </div>
        )}
        <div className="px-4 pt-4">
          <h2 className="font-display text-xl text-text">
            <span className="blink-cursor">Your Business</span>
          </h2>
        </div>
        <DashboardOverview orgName="Your Business" isDemo />
      </DashboardShell>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-3 border-t border-border bg-surface p-4 lg:left-60">
        <Link href="/signup" className="btn-primary flex-1 py-3.5 text-center">
          Activate for My Business
        </Link>
        <Link href="/#demo" className="btn-secondary hidden py-3.5 sm:inline-flex sm:px-6">
          Test on a call
        </Link>
      </div>
    </PageTransition>
  );
}
