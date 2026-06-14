import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "orange";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-slate-700 text-slate-300",
        variant === "success" && "bg-green-500/15 text-green-400 ring-1 ring-green-500/30",
        variant === "warning" && "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
        variant === "orange" && "bg-primary/15 text-primary ring-1 ring-primary/30",
        className
      )}
    >
      {children}
    </span>
  );
}
