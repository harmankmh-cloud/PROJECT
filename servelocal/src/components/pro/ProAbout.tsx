import type { ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = {
  provider: ServiceProvider;
};

export function ProAbout({ provider }: Props) {
  if (!provider.bio && !provider.years_experience) return null;

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">About</h2>
        {provider.bio && (
          <p className="mt-3 text-base leading-relaxed text-muted">{provider.bio}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {provider.years_experience && (
            <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground">
              {provider.years_experience}+ years experience
            </span>
          )}
          <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground">
            Serves {cityName(provider.city_slug)} &amp; surrounding areas
          </span>
        </div>
      </section>
    </FadeUp>
  );
}
