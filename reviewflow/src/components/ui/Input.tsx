"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={cn(
            "input-field peer pt-5",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-3 text-xs text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary"
        >
          {label}
        </label>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
