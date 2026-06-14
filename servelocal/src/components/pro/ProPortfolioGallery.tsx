import { PortfolioLightbox } from "@/components/pro/PortfolioLightbox";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = {
  photos: string[];
  providerName: string;
};

export function ProPortfolioGallery({ photos, providerName }: Props) {
  if (photos.length === 0) return null;

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Portfolio</h2>
        <p className="mt-1 text-sm text-muted">Before &amp; after photos from recent projects</p>
        <div className="mt-4">
          <PortfolioLightbox images={photos} alt={providerName} />
        </div>
      </section>
    </FadeUp>
  );
}
