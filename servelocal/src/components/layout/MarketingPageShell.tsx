import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";

export function MarketingPageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`min-h-screen bg-background text-foreground ${className ?? ""}`}>
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </main>
  );
}
