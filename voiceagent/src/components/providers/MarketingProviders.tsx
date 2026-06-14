/** Public marketing shell — no global client providers (keeps homepage JS lean). */
export function MarketingProviders({ children }: { children: React.ReactNode }) {
  return children;
}
