"use client";

import { formatNanpPhoneInput } from "@/lib/phone";
import { Input, type InputProps } from "@/components/ui/Input";

type PhoneInputProps = Omit<InputProps, "type" | "onChange"> & {
  onChange: (value: string) => void;
  value?: string;
};

export function PhoneInput({ value = "", onChange, ...props }: PhoneInputProps) {
  return (
    <Input
      {...props}
      type="tel"
      autoComplete="tel"
      inputMode="tel"
      placeholder="+1 (604) 555-0100"
      value={value}
      onChange={(e) => onChange(formatNanpPhoneInput(e.target.value))}
    />
  );
}
