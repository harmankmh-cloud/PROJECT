import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Set new password",
  description: `Choose a new password for your ${BRAND.name} account.`,
  alternates: { canonical: "/reset-password" },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
