import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBusinessManagePanel } from "@/components/AdminBusinessManagePanel";
import { getAppUrl } from "@/lib/app-url-server";
import { getAdminBusinessDetail } from "@/lib/admin-data";
import { sortPrompts } from "@/lib/defaults";
import type { PromptTemplate } from "@/lib/types";

export default async function AdminBusinessManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getAdminBusinessDetail(id);
  if (!detail) notFound();

  const appUrl = await getAppUrl();
  const prompts = sortPrompts(detail.prompts as PromptTemplate[]);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <Link href="/admin/businesses" className="text-sm font-semibold text-gold-600 hover:underline">
            ← All businesses
          </Link>
          <h1 className="font-display mt-3 text-3xl text-brand-950">{detail.business.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Support hub — fix Google links, scripts, plan, or remove the business when a customer is
            stuck.
          </p>
        </header>
        <AdminBusinessManagePanel
          business={detail.business}
          ownerEmail={detail.ownerEmail}
          appUrl={appUrl}
          prompts={prompts}
          reviewCount={detail.reviewCount}
          reviewsThisMonth={detail.reviewsThisMonth}
          pageViews={detail.pageViews}
          googleClicks={detail.googleClicks}
          recentFeedback={detail.recentFeedback}
        />
      </div>
    </main>
  );
}
