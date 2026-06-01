import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function BrandLogo({
  href = "/",
  size = "md",
  light = false,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const sizes = {
    sm: { box: "h-8 w-8 text-xs", text: "text-base" },
    md: { box: "h-10 w-10 text-sm", text: "text-xl" },
    lg: { box: "h-12 w-12 text-base", text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <div
        className={`${s.box} flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-gold-500 to-teal-400 font-bold text-brand-950 ring-2 ring-white/20 shadow-[0_8px_28px_rgba(245,158,11,0.55)] transition duration-300 group-hover:scale-105`}
      >
        ★
      </div>
      <span
        className={`font-display tracking-tight ${s.text} ${light ? "text-white" : "text-brand-950"}`}
      >
        {BRAND.name}
        {size === "lg" && !light && (
          <span className="mt-0.5 block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-600">
            Reviews made easy
          </span>
        )}
      </span>
    </Link>
  );
}
