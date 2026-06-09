import { HeroProCards } from "@/components/marketing/HeroProCards";
import { HeroSearchBar } from "@/components/marketing/HeroSearchBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="marketing-grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="font-label text-primary">🍁 British Columbia · Fraser Valley</p>
          <h1 className="font-display mt-4 text-5xl font-black leading-[1.05] tracking-tight text-slate-50 sm:text-6xl lg:text-[80px]">
            Find Trusted Local{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Pros
            </span>{" "}
            in BC
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Post your job free. Get contacted by verified tradespeople in Abbotsford, Chilliwack,
            Surrey, and across the Fraser Valley.
          </p>
          <div className="mx-auto mt-8 max-w-2xl lg:mx-0">
            <HeroSearchBar />
          </div>
        </div>
        <HeroProCards />
      </div>
    </section>
  );
}
