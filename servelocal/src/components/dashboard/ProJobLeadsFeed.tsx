"use client";

import { Lock } from "lucide-react";
import { cityName } from "@/lib/constants";
import type { ListingTier } from "@/lib/types";
import type { ServiceRequest } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

function formatPhone(phone: string) {
  if (phone.length === 10) return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
  return phone;
}

function urgencyBadge(createdAt: string) {
  const mins = (Date.now() - new Date(createdAt).getTime()) / 60000;
  if (mins < 60) return { label: `Posted ${Math.max(1, Math.round(mins))} mins ago`, variant: "warning" as const };
  const hours = mins / 60;
  if (hours < 48) return { label: `Posted ${Math.round(hours)} hours ago`, variant: "default" as const };
  const days = Math.round(hours / 24);
  return { label: `Posted ${days} days ago`, variant: "default" as const };
}

export function ProJobLeadsFeed({
  leads,
  tier,
}: {
  leads: ServiceRequest[];
  tier: ListingTier;
}) {
  const isPaid = tier === "featured" || tier === "premium";

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">No job leads in your area yet.</p>
        <p className="mt-1 text-sm text-slate-500">
          New homeowner posts matching your trade and city appear here first.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {leads.map((job) => {
        const urgency = urgencyBadge(job.created_at);
        return (
          <li
            key={job.id}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{job.customer_name}</p>
                <p className="text-xs text-slate-500">{cityName(job.city_slug)}</p>
              </div>
              <Badge variant={urgency.variant}>{urgency.label}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600 line-clamp-3">{job.description}</p>

            {isPaid ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`tel:${job.customer_phone}`} className="btn-orange px-4 py-2 text-sm">
                  Call {formatPhone(job.customer_phone)}
                </a>
                {job.customer_email && (
                  <a
                    href={`mailto:${job.customer_email}`}
                    className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Email
                  </a>
                )}
                <a
                  href={`sms:${job.customer_phone}`}
                  className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Text
                </a>
              </div>
            ) : (
              <div className="relative mt-4">
                <div className="blur-sm select-none">
                  <p className="text-sm text-slate-600">Phone: •••-•••-••••</p>
                  <p className="text-sm text-slate-600">Email: ••••@••••.com</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/5 backdrop-blur-[2px]">
                  <div className="text-center px-4">
                    <Lock className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-sm font-semibold text-primary">Featured unlocks contact</p>
                    <p className="mt-1 text-xs text-slate-600">You can see the job — upgrade to call this homeowner.</p>
                    <a href="/dashboard/pro/subscription" className="mt-2 inline-block text-xs font-semibold text-primary underline">
                      View plans
                    </a>
                  </div>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
