"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ClientOnly } from "./ClientOnly";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-14 w-14" };

function AnimatedStars({ value = 0, onChange, size = "lg", readonly }: StarRatingProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            className={cn("text-accent transition", readonly && "cursor-default")}
            whileTap={readonly ? undefined : { scale: 1.15 }}
            animate={{ scale: filled ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(sizes[size], filled ? "fill-accent text-accent" : "text-border")}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

function StaticStars({ value = 0, onChange, size = "lg", readonly }: StarRatingProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn("text-accent", readonly && "cursor-default")}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              sizes[size],
              star <= value ? "fill-accent text-accent" : "text-border"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarRating(props: StarRatingProps) {
  return (
    <ClientOnly fallback={<StaticStars {...props} />}>
      <AnimatedStars {...props} />
    </ClientOnly>
  );
}
