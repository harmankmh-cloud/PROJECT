import Link from "next/link";
import { Activity, Leaf, MapPin, ShieldCheck, Timer } from "lucide-react";

const BADGES = [
  { icon: <ShieldCheck className="h-4 w-4 text-success" />, label: "PIPEDA-aware", href: "/security" },
  { icon: <Leaf className="h-4 w-4 text-success" />, label: "CASL tooling built in", href: "/security" },
  { icon: <MapPin className="h-4 w-4 text-violet-400" />, label: "Canadian-owned · Made in BC", href: "/about" },
  { icon: <Timer className="h-4 w-4 text-violet-400" />, label: "99.9% uptime SLA", href: "/status" },
  { icon: <Activity className="h-4 w-4 text-violet-400" />, label: "System status", href: "/status" },
] as const;

/** Global trust signals — rendered inside the footer so every public page carries them. */
export function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-b border-border/60 pb-8">
      {BADGES.map((badge) => (
        <Link
          key={badge.label}
          href={badge.href}
          className="flex items-center gap-2 text-sm text-muted transition hover:text-text"
        >
          {badge.icon}
          {badge.label}
        </Link>
      ))}
    </div>
  );
}
