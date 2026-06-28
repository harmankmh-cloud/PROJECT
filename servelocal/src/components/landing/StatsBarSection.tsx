import { getPlatformStats } from "@/lib/data";
import { StatsBar } from "@/components/landing/StatsBar";

type PlatformStats = {
  providers: number;
  verified: number;
  reviews: number;
  cities: number;
};

export async function StatsBarSection({ platformStats }: { platformStats?: PlatformStats }) {
  const stats = platformStats ?? (await getPlatformStats());
  return <StatsBar platformStats={stats} />;
}
