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
        className={`${s.box} flex items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-mint-400 font-bold text-brand-950 shadow-[0_8px_24px_rgba(245,158,11,0.4)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_28px_rgba(20,184,166,0.35)]`}
      >
        ★
      </div>
      <span
        className={`font-display tracking-tight ${s.text} ${light ? "text-white" : "text-brand-950"}`}
      >
        {BRAND.name}
      </span>
    </Link>
  );
}
