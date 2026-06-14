/** Server-rendered demo page intro for SEO. */
export function DemoPageStatic() {
  return (
    <section className="marketing-container py-12 md:py-20">
      <h1 className="font-display text-3xl text-text md:text-4xl">See GreetQ answer a real call</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Pick your industry. Watch the demo. We&apos;ll call you — our AI answers so you can hear it
        yourself.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2 text-sm text-muted">
        <li className="rounded-lg border border-border px-3 py-1.5">Salon</li>
        <li className="rounded-lg border border-border px-3 py-1.5">Clinic</li>
        <li className="rounded-lg border border-border px-3 py-1.5">Restaurant</li>
        <li className="rounded-lg border border-border px-3 py-1.5">Auto Shop</li>
        <li className="rounded-lg border border-border px-3 py-1.5">Law Office</li>
      </ul>
      <p className="mt-8 max-w-2xl text-sm text-muted">
        Book a live demo call or listen to a full sample dental booking — transcript, timing, and tone.
        No signup required to explore.
      </p>
    </section>
  );
}
