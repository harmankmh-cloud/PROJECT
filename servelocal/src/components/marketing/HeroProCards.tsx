"use client";

import { BadgeCheck, Star } from "lucide-react";
import { HERO_PROS } from "@/content/copy";
import { ClientOnly } from "@/components/ui/ClientOnly";

function ProCard({
  pro,
  className,
}: {
  pro: (typeof HERO_PROS)[number];
  className?: string;
}) {
  return (
    <div
      className={`card-dark w-[220px] border-slate-600/80 shadow-xl shadow-black/20 ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
          {pro.name.charAt(0)}
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-green-400">
          <span className={`h-2 w-2 rounded-full ${pro.available ? "bg-green-500" : "bg-slate-500"}`} />
          {pro.available ? "Available today" : "Busy"}
        </span>
      </div>
      <p className="mt-3 font-semibold text-slate-50">{pro.name}</p>
      <p className="text-xs text-slate-400">
        {pro.trade} · {pro.city}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-amber-400">
          <Star className="h-3.5 w-3.5 fill-amber-400" />
          {pro.rating}
        </span>
        <span className="text-xs text-slate-500">({pro.reviews} reviews)</span>
      </div>
      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-400">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified
      </p>
    </div>
  );
}

export function HeroProCards() {
  return (
    <ClientOnly fallback={<div className="hidden h-[320px] lg:block lg:w-[280px]" />}>
      <div className="relative hidden h-[340px] w-[280px] lg:block">
        <ProCard pro={HERO_PROS[0]} className="absolute left-0 top-8 z-10 animate-float" />
        <ProCard pro={HERO_PROS[1]} className="absolute left-8 top-24 z-20 animate-float-delay-1" />
        <ProCard pro={HERO_PROS[2]} className="absolute left-16 top-40 z-30 animate-float-delay-2" />
      </div>
    </ClientOnly>
  );
}
