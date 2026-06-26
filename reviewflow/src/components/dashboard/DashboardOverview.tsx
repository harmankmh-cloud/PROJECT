"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Copy, ExternalLink, MessageSquare, QrCode, Send, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/ui/CountUp";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { useToast } from "@/components/ui/Toast";
import { SetupChecklist } from "@/components/SetupChecklist";
import { UpgradeNudge } from "@/components/dashboard/UpgradeNudge";
import { DASHBOARD } from "@/content/copy";
import { copyToClipboard } from "@/lib/copy";
import type { Business, DashboardStats, FeedbackEvent, UsageSummary } from "@/lib/types";

const ReviewsChart = dynamic(() => import("./ReviewsChart").then((m) => m.ReviewsChart), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-surface" />,
});

type Props = {
  business: Business;
  stats: DashboardStats | null;
  feedback: FeedbackEvent[];
  feedbackTotal: number;
  usage: UsageSummary | null;
  reviewUrl: string;
  reviewsThisWeek: number;
};

export function DashboardOverview({
  business,
  stats,
  feedback,
  feedbackTotal,
  usage,
  reviewUrl,
  reviewsThisWeek,
}: Props) {
  const toast = useToast();
  const conversion =
    stats && stats.pageViews > 0
      ? Math.round((stats.googleClicks / stats.pageViews) * 100)
      : 0;

  const rated = feedback.filter((f) => f.star_rating && f.star_rating > 0);
  const avgRating =
    rated.length > 0
      ? Math.round((rated.reduce((sum, f) => sum + (f.star_rating ?? 0), 0) / rated.length) * 10) / 10
      : null;

  const statCards = [
    { label: DASHBOARD.stats.totalReviews, value: feedbackTotal, icon: Star },
    { label: DASHBOARD.stats.requestsSent, value: usage?.used ?? 0, icon: Send },
    {
      label: DASHBOARD.stats.avgRating,
      value: avgRating ?? "—",
      icon: Star,
      suffix: avgRating ? " ★" : "",
      isRating: true,
    },
    { label: DASHBOARD.stats.conversion, value: conversion, icon: MessageSquare, suffix: "%" },
  ];

  async function copyLink() {
    try {
      await copyToClipboard(reviewUrl);
      toast.show("Review link copied!");
    } catch {
      toast.show("Copy failed — try again");
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="page-eyebrow">Dashboard</p>
        <h1 className="font-display mt-1 text-3xl text-text">{business.name}</h1>
      </header>

      {usage && <UpgradeNudge usage={usage} />}

      <SetupChecklist
        businessName={business.name}
        reviewUrl={reviewUrl}
        hasGoogleLink={!!business.google_review_url}
        hasFeedback={feedback.length > 0}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card-premium">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{card.label}</p>
                <Icon className={`h-4 w-4 ${card.isRating ? "fill-accent text-accent" : "text-primary"}`} />
              </div>
              <p className="font-display mt-2 text-3xl text-text">
                {typeof card.value === "number" ? (
                  <ClientOnly fallback={<span>{card.value}{card.suffix}</span>}>
                    <CountUp value={card.value} suffix={card.suffix} />
                  </ClientOnly>
                ) : (
                  <span>{card.value}{card.suffix}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {reviewsThisWeek >= 3 && (
        <div className="flex items-center gap-4 rounded-2xl border border-success-bg bg-success-bg px-6 py-4">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-success">
              {reviewsThisWeek} review{reviewsThisWeek === 1 ? "" : "s"} this week — great momentum!
            </p>
            <p className="mt-0.5 text-sm text-success/80">
              Keep it up — businesses that collect consistently rank higher on Google Maps.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/share" className="btn-ghost flex items-center gap-2 py-3">
          <Send className="h-4 w-4" />
          {DASHBOARD.quickActions.sendRequest}
        </Link>
        <Link href="/dashboard/share" className="btn-ghost flex items-center gap-2 py-3">
          <QrCode className="h-4 w-4" />
          {DASHBOARD.quickActions.downloadQr}
        </Link>
        <button type="button" onClick={copyLink} className="btn-ghost flex items-center gap-2 py-3">
          <Copy className="h-4 w-4" />
          {DASHBOARD.quickActions.copyLink}
        </button>
        <Link href={reviewUrl} target="_blank" rel="noreferrer" className="btn-ghost flex items-center gap-2 py-3">
          <ExternalLink className="h-4 w-4" />
          {DASHBOARD.quickActions.viewPage}
        </Link>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-lg text-text">Recent requests</h2>
        {feedback.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Send your first review request from Share →</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="pb-2 pr-4 font-medium">Customer</th>
                  <th className="pb-2 pr-4 font-medium">Date</th>
                  <th className="pb-2 pr-4 font-medium">Rating</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {feedback.slice(0, 5).map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    <td className="py-3 pr-4">{row.customer_name || "Anonymous"}</td>
                    <td className="py-3 pr-4 text-muted">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      {row.star_rating ? `${row.star_rating} ★` : "—"}
                    </td>
                    <td className="py-3">
                      <Badge variant={row.is_private ? "warning" : "success"}>
                        {row.is_private ? "Private feedback" : "Reviewed ✓"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ClientOnly fallback={<div className="h-48 rounded-2xl bg-surface" />}>
        <ReviewsChart feedback={feedback} />
      </ClientOnly>
    </div>
  );
}
