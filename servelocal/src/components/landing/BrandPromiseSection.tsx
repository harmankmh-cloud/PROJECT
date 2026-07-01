import Link from "next/link";
import {
  BadgeCheck,
  ClipboardCheck,
  MapPinned,
  MessageSquareHeart,
} from "lucide-react";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Profiles reviewed for trust",
    body: "We highlight pros with complete profiles, clear service areas, and strong homeowner feedback.",
    href: "/search",
    cta: "Explore pros",
  },
  {
    icon: ClipboardCheck,
    title: "Clear request flow",
    body: "Tell us the job, area, and timing once. Get matched without repeating your details.",
    href: "/request",
    cta: "Post a job",
  },
  {
    icon: MessageSquareHeart,
    title: "Homeowner-first experience",
    body: "Designed to remove guesswork with transparent profile details and straightforward next steps.",
    href: "/about",
    cta: "Why ServeLocal",
  },
  {
    icon: MapPinned,
    title: "Built in BC, expanding across Canada",
    body: "Local trade categories and service areas tuned for BC homeowners and contractors.",
    href: "/guides",
    cta: "View cost guides",
  },
] as const;

export function BrandPromiseSection() {
  return (
    <section className="border-y border-border bg-surface/40 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="text-center">
          <p className="font-label text-primary">The ServeLocal standard</p>
          <h2 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
            A brand built on homeowner trust
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Every surface is designed for confidence: clearer listings, faster matching, and a
            direct path from search to booked work.
          </p>
        </FadeUp>

        <StaggerGrid className="mt-10 grid gap-4 md:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, body, href, cta }) => (
            <StaggerItem key={title}>
              <div className="card-glow flex h-full flex-col rounded-[14px] border border-border bg-background p-6 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-4 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{body}</p>
                <Link
                  href={href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary-light"
                >
                  {cta} →
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
