import Link from "next/link";

export function LandingCta() {
  return (
    <section className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-primary/30 bg-gradient-to-br from-surface to-background p-10 text-center">
        <h2 className="font-display text-3xl font-black text-slate-50">Ready to hire a local pro?</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Post your job free. Contractors: list your business and browse leads in your area.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/request" className="btn-orange px-8 py-3 text-base">
            Post a Job — Free
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-8 py-3 text-base font-semibold text-slate-50 transition hover:border-primary/50"
          >
            List Your Business
          </Link>
        </div>
      </div>
    </section>
  );
}
