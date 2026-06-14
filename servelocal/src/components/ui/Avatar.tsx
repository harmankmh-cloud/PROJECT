import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover ring-2 ring-amber-400/30", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-white ring-2 ring-amber-400/30",
        sizes[size],
        className
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
