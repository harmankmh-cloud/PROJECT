import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ClaimBusinessFlow } from "@/components/auth/ClaimBusinessFlow";

export const metadata: Metadata = {
  title: "Claim Your Business",
  description: "Claim and verify your business listing on RateLocal.",
};

export default function ClaimBusinessPage() {
  return (
    <main>
      <LandingNavbar />
      <ClaimBusinessFlow />
    </main>
  );
}
