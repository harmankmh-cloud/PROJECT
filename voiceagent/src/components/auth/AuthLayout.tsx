import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { SkipToContent } from "@/components/SkipToContent";

export function AuthLayout({
  children,
  panelFooter,
}: {
  children: React.ReactNode;
  panelFooter: string;
}) {
  return (
    <div className="aurora-bg flex min-h-screen flex-col">
      <SkipToContent />
      <div className="flex flex-1">
        <AuthMarketingPanel footer={panelFooter} />
        <main id="main-content" className="flex w-full flex-1 items-center justify-center px-4 py-12 lg:w-[55%]">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <BrandLogo href="/" />
            </div>
            {children}
          </div>
        </main>
      </div>
      <MarketingFooterNew />
    </div>
  );
}
