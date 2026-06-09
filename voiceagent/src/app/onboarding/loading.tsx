import { PageLoadingSkeleton } from "@/components/ui/PageLoadingSkeleton";

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-bg">
      <div className="h-1 bg-surface" />
      <div className="marketing-container max-w-2xl space-y-6 py-12">
        <div className="h-8 w-48 rounded-lg bg-surface" />
        <div className="h-64 rounded-xl bg-surface" />
        <div className="flex justify-between">
          <div className="h-10 w-24 rounded-lg bg-surface" />
          <div className="h-10 w-24 rounded-lg bg-primary/30" />
        </div>
      </div>
    </div>
  );
}
