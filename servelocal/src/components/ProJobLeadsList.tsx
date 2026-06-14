"use client";

import { cityName } from "@/lib/constants";
import type { ServiceRequest } from "@/lib/types";

function formatPhone(phone: string) {
  if (phone.length === 10) return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
  return phone;
}

function urgencyLabel(u?: string | null) {
  if (!u) return null;
  return u.replace(/_/g, " ");
}

export function ProJobLeadsList({ leads, citySlug }: { leads: ServiceRequest[]; citySlug: string }) {
  if (leads.length === 0) {
    return (
      <div className="surface-card mt-4 p-6 text-center">
        <p className="text-slate-600">No recent jobs in your area yet.</p>
        <p className="mt-1 text-sm text-slate-500">
          When homeowners post jobs in {cityName(citySlug)} matching your trade, you&apos;ll get an email alert and
          they&apos;ll show here.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {leads.map((job) => (
        <li key={job.id} className="surface-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-brand-950">{job.customer_name}</p>
              <p className="text-xs text-slate-500">
                {cityName(job.city_slug)} · {urgencyLabel(job.urgency) || "Posted"}{" "}
                · {new Date(job.created_at).toLocaleDateString("en-CA")}
              </p>
            </div>
            <a href={`tel:${job.customer_phone}`} className="btn-gold px-4 py-2 text-sm">
              Call {formatPhone(job.customer_phone)}
            </a>
          </div>
          <p className="mt-3 text-sm text-slate-600 line-clamp-3">{job.description}</p>
        </li>
      ))}
    </ul>
  );
}
