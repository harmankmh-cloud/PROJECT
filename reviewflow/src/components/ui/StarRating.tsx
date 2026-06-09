"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientOnly } from "./ClientOnly";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  /** Animate fill left-to-right on mount */
  animateOnLoad?: boolean;
  showValue?: boolean;
};

const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
const gapSizes = { sm: "gap-0.5", md: "gap-1", lg: "gap-2" };

function StarIcon({
  filled,
  partial,
  size,
  index,
  animateOnLoad,
}: {
  filled: boolean;
  partial: number;
  size: "sm" | "md" | "lg";
  index: number;
  animateOnLoad?: boolean;
}) {
  const fillPercent = filled ? 100 : partial > 0 ? partial * 100 : 0;

  return (
    <span className="relative inline-flex">
      <Star className={cn(sizes[size], "text-border")} />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        <Star className={cn(sizes[size], "fill-star text-star min-w-max")} />
      </span>
      {animateOnLoad && fillPercent > 0 && (
        <motion.span
          className="pointer-events-none absolute inset-0 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        >
          <Star className={cn(sizes[size], "fill-star text-star min-w-max")} />
        </motion.span>
      )}
    </span>
  );
}

function AnimatedStars({
  value = 0,
  onChange,
  size = "lg",
  readonly,
  animateOnLoad,
  showValue,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("flex", gapSizes[size])}
        role="group"
        aria-label={`${value} out of 5 stars`}
        onMouseLeave={() => !readonly && setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(display);
          const partial =
            !filled && star === Math.ceil(display) && display % 1 > 0
              ? display % 1
              : 0;

          if (readonly) {
            return (
              <StarIcon
                key={star}
                filled={filled}
                partial={partial}
                size={size}
                index={star - 1}
                animateOnLoad={animateOnLoad}
              />
            );
          }

          return (
            <motion.button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHover(star)}
              className="text-star transition"
              whileTap={{ scale: 1.15 }}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <StarIcon
                filled={star <= display}
                partial={0}
                size={size}
                index={star - 1}
                animateOnLoad={false}
              />
            </motion.button>
          );
        })}
      </div>
      {showValue && value > 0 && (
        <span className="text-sm font-semibold text-text">{value.toFixed(1)}</span>
      )}
    </div>
  );
}

function StaticStars(props: StarRatingProps) {
  const { value = 0, onChange, size = "lg", readonly, animateOnLoad, showValue } = props;

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex", gapSizes[size])} role="group" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(value);
          const partial =
            !filled && star === Math.ceil(value) && value % 1 > 0 ? value % 1 : 0;

          if (readonly) {
            return (
              <StarIcon
                key={star}
                filled={filled}
                partial={partial}
                size={size}
                index={star - 1}
                animateOnLoad={animateOnLoad}
              />
            );
          }

          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(star)}
              className={cn("text-star", readonly && "cursor-default")}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  sizes[size],
                  star <= value ? "fill-star text-star" : "text-border"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && value > 0 && (
        <span className="text-sm font-semibold text-text">{value.toFixed(1)}</span>
      )}
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

/** Compact display-only stars with fractional support */
export function StarDisplay({
  value,
  size = "sm",
  animateOnLoad = true,
  showValue = false,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  animateOnLoad?: boolean;
  showValue?: boolean;
}) {
  return (
    <StarRating
      value={value}
      readonly
      size={size}
      animateOnLoad={animateOnLoad}
      showValue={showValue}
    />
  );
}
