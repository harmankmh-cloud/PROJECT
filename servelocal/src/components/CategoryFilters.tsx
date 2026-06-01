"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function CategoryFilters({ city, category }: { city: string; category: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function href(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  }

  const licensed = searchParams.get("licensed") === "1";
  const verified = searchParams.get("verified") === "1";
  const emergency = searchParams.get("emergency") === "1";
  const sort = searchParams.get("sort") || "recommended";

  const chips = [
    { label: "Licensed", active: licensed, href: href({ licensed: licensed ? null : "1" }) },
    { label: "Verified", active: verified, href: href({ verified: verified ? null : "1" }) },
    { label: "24/7 emergency", active: emergency, href: href({ emergency: emergency ? null : "1" }) },
  ];

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className={chip.active ? "chip-tag-active" : "chip-tag"}
          >
            {chip.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Sort:</span>
        {[
          { id: "recommended", label: "Recommended" },
          { id: "rating", label: "Top rated" },
          { id: "experience", label: "Most experience" },
          { id: "reviews", label: "Most reviews" },
        ].map((opt) => (
          <Link
            key={opt.id}
            href={href({ sort: opt.id === "recommended" ? null : opt.id })}
            className={sort === opt.id || (opt.id === "recommended" && sort === "recommended")
              ? "font-semibold text-teal-600"
              : "text-slate-600 hover:text-teal-600"}
          >
            {opt.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
