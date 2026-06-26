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
    <main className={`marketing-page min-h-screen bg-white ${className}`}>
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </main>
  );
}
