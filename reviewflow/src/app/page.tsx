import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">ReviewFlow</p>
            <p className="text-sm text-zinc-600">Reviews + simple marketing for local businesses</p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Start free
            </Link>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Help customers write honest Google reviews faster.
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Give your business a QR code and review link. Customers choose their experience,
              get help writing a review, and you turn good feedback into social posts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Create my review page
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-800"
              >
                Business login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Example customer flow</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-700">
              <p>1. Customer scans QR code</p>
              <p>2. Chooses Great / Good / Okay / Not good</p>
              <p>3. Types a few words about the visit</p>
              <p>4. AI helps write a clear review draft</p>
              <p>5. Customer edits and posts on Google</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Review helper",
              text: "Customers get review drafts based on their experience level.",
            },
            {
              title: "Private feedback",
              text: "Unhappy customers can send calm private feedback before posting publicly.",
            },
            {
              title: "Marketing tools",
              text: "Turn good reviews into social captions and reply drafts.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-zinc-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Simple pricing to start</h2>
          <p className="mt-2 text-zinc-300">One plan for now while we launch with local businesses.</p>
          <div className="mt-6 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-4xl font-semibold">$39</p>
              <p className="text-sm text-zinc-300">per month</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">$99</p>
              <p className="text-sm text-zinc-300">one-time setup</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
