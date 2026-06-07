import { IntegrationConnectors } from "@/components/IntegrationConnectors";

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const params = await searchParams;
  const initialMessage = params.connected
    ? `Connected ${params.connected}`
    : params.error
      ? `Error: ${params.error}`
      : "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Integrations</h1>
      <p className="mt-1 text-slate-500">Connect CRM and calendar tools.</p>
      <IntegrationConnectors initialMessage={initialMessage} />
    </div>
  );
}
