import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { SERVE_LOCAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SERVE_LOCAL.name} collects, uses, and protects your personal information in British Columbia.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm text-slate-500">Last updated: May 29, 2026</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Who we are</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {SERVE_LOCAL.name} ({SERVE_LOCAL.region}, Canada) operates a local trades directory at
          servelocal.ca. We connect homeowners with service providers. Contact:{" "}
          <a href="mailto:hello@servelocal.ca" className="font-semibold text-teal-600 hover:underline">
            hello@servelocal.ca
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Information we collect</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>Account details: email address and password (stored using industry-standard encryption).</li>
          <li>Job requests: name, phone, email, city, service type, and job description you submit.</li>
          <li>Business listings: business name, contact info, licence claims, and profile content for pros.</li>
          <li>Usage data: pages visited, device/browser type, and IP address (standard web logs).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">How we use your information</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>To create and manage your account and dashboard.</li>
          <li>To match job requests with local service providers.</li>
          <li>To display and moderate business listings and reviews.</li>
          <li>To send transactional emails (confirmations, password resets) via our email provider.</li>
          <li>To improve the platform and respond to support requests.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Legal basis (PIPEDA)</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We collect and use personal information with your consent (for example when you create an account or
          submit a job request), and as necessary to provide the service you requested. You may withdraw consent
          for marketing emails at any time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Where data is stored</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Data is hosted by secure cloud providers in Canada or the United States under contractual safeguards.
          Email is sent through our transactional email provider.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Marketing (CASL)</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We only send promotional email if you opt in. Transactional messages (account confirmation, job
          updates) are not marketing. Unsubscribe links are included on promotional messages.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Your rights</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You may request access to, correction of, or deletion of your personal information by emailing{" "}
          <a href="mailto:hello@servelocal.ca" className="font-semibold text-teal-600 hover:underline">
            hello@servelocal.ca
          </a>
          . We respond within 30 days where required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Related policies</h2>
        <p className="text-sm text-slate-600">
          See also our{" "}
          <Link href="/terms" className="font-semibold text-teal-600 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
