import { getPlatformStats } from "@/lib/data";
import { StatsBar } from "@/components/landing/StatsBar";

export async function StatsBarSection() {
  const stats = await getPlatformStats();
  return <StatsBar platformStats={stats} />;
}
