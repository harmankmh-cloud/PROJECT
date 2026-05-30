import Link from "next/link";

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
    md: { box: "h-9 w-9 text-sm", text: "text-lg" },
    lg: { box: "h-11 w-11 text-base", text: "text-xl" },
  };
  const s = sizes[size];

  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <div
        className={`${s.box} flex items-center justify-center rounded-xl bg-gold-500 font-bold text-brand-950 shadow-[0_2px_8px_rgba(245,158,11,0.35)]`}
      >
        ★
      </div>
      <span className={`font-display ${s.text} ${light ? "text-white" : "text-brand-950"}`}>
        ReviewFlow
      </span>
    </Link>
  );
}
