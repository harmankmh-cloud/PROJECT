import Link from "next/link";

export function TermsConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5"
        required
      />
      <span>
        I agree to the{" "}
        <Link href="/terms" className="font-semibold text-teal-600 hover:underline" target="_blank">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-teal-600 hover:underline" target="_blank">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
