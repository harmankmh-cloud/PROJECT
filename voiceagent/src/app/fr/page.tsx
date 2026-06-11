import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MessageSquareText, PhoneIncoming, ShieldCheck } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { FrWaitlistForm } from "@/components/landing/FrWaitlistForm";
import { GlowButton } from "@/components/ui/GlowButton";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Réceptionniste IA pour entreprises canadiennes",
  description: `${BRAND.name} répond à vos appels 24h/24, prend les rendez-vous et répond aux questions courantes — conçu pour les entreprises canadiennes. Support vocal en français à venir.`,
  alternates: { canonical: "/fr" },
};

const FEATURES = [
  {
    icon: <PhoneIncoming className="h-5 w-5 text-violet-300" />,
    title: "Réponse en moins de 2 secondes",
    desc: "Chaque appel est pris en charge, jour et nuit — fini la boîte vocale.",
  },
  {
    icon: <Calendar className="h-5 w-5 text-teal-400" />,
    title: "Prise de rendez-vous en direct",
    desc: "Réservation directe dans Google Agenda avec confirmation par texto.",
  },
  {
    icon: <MessageSquareText className="h-5 w-5 text-violet-300" />,
    title: "Résumé IA après chaque appel",
    desc: "Résumé, sentiment du client et actions à suivre — automatiquement.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
    title: "Conçu pour le Canada",
    desc: "Conformité LPRPDE (PIPEDA) et outils LCAP (CASL) intégrés.",
  },
] as const;

export default function FrenchLandingPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col" lang="fr">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <section className="marketing-container mx-auto max-w-3xl text-center">
          <p className="section-eyebrow mb-3">🍁 Pour les entreprises canadiennes</p>
          <Link href="/" className="text-sm text-violet-400 transition hover:text-violet-300">
            English version →
          </Link>
          <h1 className="font-display text-4xl text-ghost-white md:text-5xl">
            Votre entreprise ne manque plus jamais un appel
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-on-surface-variant">
            {BRAND.name} répond à vos appels 24h/24, prend les rendez-vous et répond aux questions
            de vos clients — pendant que vous travaillez.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton href="/signup">Essai gratuit</GlowButton>
            <GlowButton href="/demo" variant="ghost">
              Voir la démo
            </GlowButton>
          </div>
        </section>

        <section className="marketing-container mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                {f.icon}
              </span>
              <h2 className="mt-4 font-display text-lg text-text">{f.title}</h2>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="marketing-container mx-auto mt-16 max-w-2xl">
          <div className="glass-card p-8 text-center">
            <h2 className="font-display text-2xl text-text">
              L&apos;agent vocal en français arrive bientôt
            </h2>
            <p className="mt-3 text-sm text-muted">
              L&apos;interface et l&apos;agent répondent en anglais aujourd&apos;hui. Le support
              vocal en français est en développement pour les opérateurs canadiens — inscrivez-vous
              pour un accès anticipé.
            </p>
            <FrWaitlistForm />
            <p className="mt-4 text-xs text-muted">
              Des questions?{" "}
              <Link href={`mailto:${BRAND.contact.email}`} className="text-violet-400 hover:underline">
                {BRAND.contact.email}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
