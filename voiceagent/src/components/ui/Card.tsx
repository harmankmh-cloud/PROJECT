import { forwardRef } from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  glass?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glow = true, glass = false, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl p-6 ${glow ? "card-glow" : "border border-border bg-surface"} ${glass ? "glass-card" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
