import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Reveal } from "@/components/ui/Reveal";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="marketing-page rl-dark rl-legal min-h-screen">
      <MarketingNavbar />
      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <h1 className="font-grotesk text-4xl text-ink sm:text-5xl">{title}</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="rl-glass mt-8 space-y-6 p-6 sm:p-8">{children}</div>
        </Reveal>
      </article>
      <MarketingFooter />
    </main>
  );
}
