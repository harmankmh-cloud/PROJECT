import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    />
  );
}
