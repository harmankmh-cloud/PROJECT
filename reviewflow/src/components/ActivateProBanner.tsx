import { activateProAction } from "@/app/dashboard/billing/actions";

type Props = {
  show: boolean;
  sessionId?: string;
  error?: string;
};

export function ActivateProBanner({ show, sessionId, error }: Props) {
  if (!show) return null;

  return (
    <div className="rounded-xl border-2 border-gold-400 bg-gold-50 px-4 py-4 text-sm text-brand-950">
      <p className="font-semibold">Paid but still on Free trial?</p>
      <p className="mt-1 text-brand-900/80">
        Click below to link your Stripe payment to this account. You will not be charged again.
      </p>

      {error && (
        <div className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-rose-900">
          <p className="font-medium">Could not activate Pro</p>
          <p className="mt-1 text-xs leading-relaxed">{error}</p>
        </div>
      )}

      <form action={activateProAction} className="mt-4">
        {sessionId ? <input type="hidden" name="sessionId" value={sessionId} /> : null}
        <button type="submit" className="btn-dark w-full py-3">
          Activate Pro — I already paid
        </button>
      </form>

      {error && (
        <ol className="mt-3 list-decimal space-y-1 pl-4 text-xs text-brand-900/80">
          <li>Run migration SQL in Supabase (see chat instructions)</li>
          <li>Add SUPABASE_SERVICE_ROLE_KEY to .env.local</li>
          <li>Run: npm run update</li>
        </ol>
      )}
    </div>
  );
}
