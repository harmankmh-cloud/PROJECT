import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { COMPANY } from "@/lib/marketing-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Help",
  description: "Contact ServeLocal for listing help, billing questions, or general support. We reply within 1–2 business days.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="section-eyebrow">Help & contact</p>
          <h1 className="font-display mt-2 text-4xl text-brand-950">Get in touch</h1>
          <p className="mt-3 text-slate-600">
            Questions about listings, job posts, or your account? Send a message — or email us directly.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-brand-950">Email</dt>
              <dd>
                <a href={`mailto:${COMPANY.email}`} className="text-teal-600 hover:underline">
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-950">Region</dt>
              <dd className="text-slate-600">{COMPANY.address}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-950">Pros</dt>
              <dd>
                <Link href="/join" className="text-teal-600 hover:underline">
                  Apply for a listing →
                </Link>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-950">Homeowners</dt>
              <dd>
                <Link href="/request" className="text-teal-600 hover:underline">
                  Post a job for free quotes →
                </Link>
              </dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </div>
      <SiteFooter />
    </main>
  );
}
