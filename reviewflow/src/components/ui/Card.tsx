import { cn } from "@/lib/utils";

export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("card-surface p-6", className)} style={style}>
      {children}
    </div>
  );
}
