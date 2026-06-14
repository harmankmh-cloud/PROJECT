"use client";

import Link from "next/link";
import {
  Activity,
  BookOpen,
  Building2,
  ChevronDown,
  Code2,
  Gavel,
  Home,
  Menu,
  Plug,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { TRIAL_MARKETING } from "@/lib/trial";
import { GlowButton } from "@/components/ui/GlowButton";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";

type MenuItem = { href: string; label: string; desc: string; icon: React.ReactNode };

const PRODUCT_MENU: MenuItem[] = [
  { href: "/features", label: "Features", desc: "Everything your AI receptionist does", icon: <Sparkles className="h-4 w-4" /> },
  { href: "/integrations", label: "Integrations", desc: "Calendar, CRM, SMS, and webhooks", icon: <Plug className="h-4 w-4" /> },
  { href: "/docs", label: "Developers & API", desc: "REST API, webhooks, and docs", icon: <Code2 className="h-4 w-4" /> },
  { href: "/security", label: "Security", desc: "PIPEDA, CASL, and HIPAA controls", icon: <ShieldCheck className="h-4 w-4" /> },
  { href: "/status", label: "Status", desc: "Live uptime and incident history", icon: <Activity className="h-4 w-4" /> },
  { href: "/compare", label: "Compare", desc: "GreetQ vs the alternatives", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/changelog", label: "Changelog", desc: "Product updates and release notes", icon: <Activity className="h-4 w-4" /> },
  { href: "/resources/buyers-guide", label: "Buyer's guide", desc: "Evaluate AI receptionists — free checklist", icon: <BookOpen className="h-4 w-4" /> },
];

const INDUSTRIES_MENU: MenuItem[] = [
  { href: "/dental", label: "Dental & medical", desc: "After-hours booking, privacy-aware intake", icon: <Stethoscope className="h-4 w-4" /> },
  { href: "/hvac", label: "HVAC", desc: "Qualify and triage before dispatch", icon: <Thermometer className="h-4 w-4" /> },
  { href: "/legal", label: "Legal", desc: "Screened intake with full audit trail", icon: <Gavel className="h-4 w-4" /> },
  { href: "/contractors", label: "Contractors", desc: "Capture job details on first ring", icon: <Wrench className="h-4 w-4" /> },
  { href: "/real-estate", label: "Real estate", desc: "Never miss a listing inquiry", icon: <Home className="h-4 w-4" /> },
  { href: "/salons", label: "Salons & spas", desc: "Book while stylists stay with clients", icon: <Scissors className="h-4 w-4" /> },
  { href: "/restaurants", label: "Restaurants", desc: "Reservations and hours, answered", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { href: "/property-managers", label: "Property managers", desc: "Tenant calls routed and logged", icon: <Building2 className="h-4 w-4" /> },
];

const TOP_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/blog", label: "Blog" },
] as const;

function DesktopDropdown({
  label,
  items,
  wide,
}: {
  label: string;
  items: MenuItem[];
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-muted transition hover:text-text"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        onFocus={show}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${wide ? "w-[560px]" : "w-[400px]"}`}
          role="menu"
        >
          <div className="rounded-xl border border-border bg-surface p-2 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className={`grid gap-1 ${wide ? "grid-cols-2" : "grid-cols-1"}`}>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className="group flex items-start gap-3 rounded-lg p-3 transition hover:bg-violet-500/10"
                  onClick={() => setOpen(false)}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/20">
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-text">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">{item.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: MenuItem[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-lg text-text"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown className={`h-5 w-5 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="pb-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-base text-muted"
              onClick={onNavigate}
            >
              <span className="text-violet-300">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-colors ${
        scrolled ? "border-border/80 bg-bg md:bg-bg/95 md:backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="marketing-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-text">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 ring-1 ring-violet-500/30">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </span>
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          <DesktopDropdown label="Product" items={PRODUCT_MENU} />
          <DesktopDropdown label="Industries" items={INDUSTRIES_MENU} wide />
          {TOP_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm text-muted transition hover:text-text">
            Sign in
          </Link>
          <GlowButton href="/signup">{TRIAL_MARKETING.cta}</GlowButton>
        </div>

        <button
          type="button"
          className="rounded-lg border border-border p-2 text-muted lg:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-bg/97 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between p-5">
            <span className="font-display text-lg text-text">{BRAND.name}</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-text" />
            </button>
          </div>
          <nav className="flex flex-col px-5 pb-16 pt-4" aria-label="Mobile">
            <MobileGroup label="Product" items={PRODUCT_MENU} onNavigate={() => setOpen(false)} />
            <MobileGroup label="Industries" items={INDUSTRIES_MENU} onNavigate={() => setOpen(false)} />
            {TOP_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-border/60 py-3 text-lg text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="rounded-lg border border-border py-3 text-center text-text"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <GlowButton href="/signup" className="py-3">
                {TRIAL_MARKETING.cta}
              </GlowButton>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
