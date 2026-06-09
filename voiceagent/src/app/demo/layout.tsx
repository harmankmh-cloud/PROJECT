import { GeistMono } from "geist/font/mono";
import { DashboardProviders } from "@/components/providers/AppProviders";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={GeistMono.variable}>
      <DashboardProviders>{children}</DashboardProviders>
    </div>
  );
}
