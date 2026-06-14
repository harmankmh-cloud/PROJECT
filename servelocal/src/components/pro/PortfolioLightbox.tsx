"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
};

export function PortfolioLightbox({ images, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="mb-3 w-full break-inside-avoid overflow-hidden rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`${alt} portfolio ${i + 1}`} className="w-full object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex((i) => (i - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex((i) => (i + 1) % images.length);
                  }}
                  className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-16"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
