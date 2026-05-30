import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
            R
          </div>
          <span className="text-lg font-semibold text-slate-900">ReviewFlow</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
            Start free
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Built for local businesses in Canada
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
            Turn happy customers into{" "}
            <span className="text-emerald-600">Google reviews</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Share a QR code. Customers pick how their visit went. AI writes a
            natural review draft — and unhappy feedback stays private so you can
            fix issues before they go public.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto">
              Create your account
            </Link>
            <Link href="/login" className="btn-secondary w-full px-8 py-3.5 text-base sm:w-auto">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Print your QR code",
              text: "Put it at the counter, on receipts, or in a follow-up text.",
            },
            {
              step: "2",
              title: "Customer picks their experience",
              text: "Great, good, okay, or not good — simple and fast on any phone.",
            },
            {
              step: "3",
              title: "AI helps with the rest",
              text: "Happy visits get review drafts. Unhappy visits send private feedback to you.",
            },
          ].map((item) => (
            <div key={item.step} className="card p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                {item.step}
              </div>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Simple pricing</h2>
          <p className="mt-2 text-slate-600">No contracts. Cancel anytime.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <div>
              <p className="text-3xl font-bold text-slate-900">$99</p>
              <p className="text-sm text-slate-500">One-time setup</p>
            </div>
            <div className="hidden h-12 w-px bg-slate-200 sm:block" />
            <div>
              <p className="text-3xl font-bold text-slate-900">
                $39<span className="text-lg font-medium text-slate-500">/mo</span>
              </p>
              <p className="text-sm text-slate-500">Starter plan</p>
            </div>
          </div>
          <Link href="/signup" className="btn-primary mt-8 inline-flex px-8 py-3">
            Get started
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        ReviewFlow — review collection for local businesses
      </footer>
    </main>
  );
}
