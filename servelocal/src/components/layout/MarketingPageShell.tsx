import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";

export function MarketingPageShell({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <main
      className={`min-h-screen ${dark ? "sl-dark text-slate-100" : "bg-background text-foreground"} ${className ?? ""}`}
    >
      <MarketingNavbar tone={tone} />
      {children}
      <MarketingFooter tone={tone} />
    </main>
  );
}
