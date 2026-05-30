import Link from "next/link";
import type { Business, DashboardStats, UsageSummary } from "@/lib/types";

const sections = [
  {
    href: "/dashboard/reviews",
    title: "My reviews",
    description: "See customer feedback and export CSV",
    icon: "⭐",
  },
  {
    href: "/dashboard/share",
    title: "QR & sharing",
    description: "Download your poster and copy messages",
    icon: "📱",
  },
  {
    href: "/dashboard/settings",
    title: "My business",
    description: "Update name, industry, and Google link",
    icon: "⚙",
  },
  {
    href: "/dashboard/billing",
    title: "My plan",
    description: "Usage this month and upgrade options",
    icon: "◈",
  },
];

type Props = {
  business: Business;
  stats: DashboardStats | null;
  usage: UsageSummary | null;
  feedbackTotal: number;
  reviewUrl: string;
};

export function ControlCenterHub({ business, stats, usage, feedbackTotal, reviewUrl }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Reviews</p>
          <p className="font-display mt-1 text-3xl text-brand-950">{feedbackTotal}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Page visits</p>
          <p className="font-display mt-1 text-3xl text-brand-950">{stats?.pageViews ?? 0}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Google opened</p>
          <p className="font-display mt-1 text-3xl text-brand-950">{stats?.googleClicks ?? 0}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">This month</p>
          <p className="font-display mt-1 text-3xl text-brand-950">
            {usage ? `${usage.used}/${usage.limit}` : "—"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-brand-950">Quick links</h2>
        <p className="mt-1 text-sm text-stone-500">Everything you need — kept simple.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="surface-card group block p-5 transition hover:border-gold-500/40 hover:shadow-md"
            >
              <span className="text-2xl">{section.icon}</span>
              <h3 className="mt-3 font-semibold text-brand-950 group-hover:text-gold-600">
                {section.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{section.description}</p>
              <p className="mt-3 text-sm font-semibold text-gold-600">Open →</p>
            </Link>
          ))}
          <Link
            href={`/r/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="surface-card group block border-dashed p-5 transition hover:border-gold-500/40"
          >
            <span className="text-2xl">↗</span>
            <h3 className="mt-3 font-semibold text-brand-950">Preview my page</h3>
            <p className="mt-1 truncate text-sm text-stone-500">{reviewUrl}</p>
            <p className="mt-3 text-sm font-semibold text-gold-600">Open in new tab →</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
