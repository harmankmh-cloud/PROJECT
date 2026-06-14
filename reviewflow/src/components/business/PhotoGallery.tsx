"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function PhotoGallery({ photos, businessName }: { photos: string[]; businessName: string }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <FadeInSection className="marketing-container py-8">
      <h2 className="font-display mb-4 text-xl font-bold text-text">Photos</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {photos.slice(0, 8).map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setLightbox(url)}
            className={`card-glow relative overflow-hidden p-0 ${
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[200px]" : "aspect-square"
            }`}
          >
            <Image
              src={url}
              alt={`${businessName} photo ${i + 1}`}
              fill
              className="object-cover transition hover:scale-105"
              sizes={i === 0 ? "400px" : "200px"}
            />
          </button>
        ))}
      </div>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="border-none bg-transparent p-0 shadow-none">
          {lightbox && (
            <div className="relative aspect-video w-full">
              <Image src={lightbox} alt="" fill className="rounded-xl object-contain" sizes="800px" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </FadeInSection>
  );
}
