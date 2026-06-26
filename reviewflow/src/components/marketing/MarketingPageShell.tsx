import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";

export function MarketingPageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`marketing-page rl-dark min-h-screen ${className}`}>
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </main>
  );
}
