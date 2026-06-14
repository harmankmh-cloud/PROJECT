import { TESTIMONIALS } from "@/lib/marketing-content";

export function TestimonialsSection() {
  return (
    <section className="border-t border-border py-20" id="testimonials">
      <div className="marketing-container">
        <h2 className="font-display mb-12 text-center text-3xl text-text">
          Trusted by local businesses
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="glass-card flex h-full flex-col p-6"
            >
              <p className="flex-1 text-base leading-relaxed text-text">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-muted">
                <span className="font-medium text-text">{t.name}</span>
                {" · "}
                {t.role}, {t.company}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
