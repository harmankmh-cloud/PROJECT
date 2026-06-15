import { cityName } from "@/lib/constants";
import { COMPANY } from "@/lib/marketing-content";
import { FOUNDING_PRO } from "@/lib/tradie-program";

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";

function layout(body: string) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#1e293b;line-height:1.5;max-width:560px;margin:0 auto;padding:24px">
<p style="font-weight:700;color:#0f766e">ServeLocal</p>
${body}
<p style="margin-top:32px;font-size:12px;color:#94a3b8">ServeLocal · ${COMPANY.address}<br/>Questions? ${COMPANY.email}</p>
</body></html>`;
}

export function jobPostedEmail(input: {
  customerName: string;
  categoryName: string;
  citySlug: string;
  matchCount: number;
  isGuest?: boolean;
}) {
  const subject = `Your ${input.categoryName} job is posted — ServeLocal`;
  const ctaHref = input.isGuest ? `${appUrl}/signup` : `${appUrl}/dashboard`;
  const ctaLabel = input.isGuest ? "Create a free account to track your job" : "View your dashboard";
  const html = layout(`
<p>Hi ${input.customerName},</p>
<p>Your job request for <strong>${input.categoryName}</strong> in <strong>${cityName(input.citySlug)}</strong> is live.</p>
<p>${input.matchCount > 0 ? `We found <strong>${input.matchCount}</strong> matching pro${input.matchCount === 1 ? "" : "s"} you can call direct.` : "Our team is manually matching you with vetted local pros — expect follow-up within 24 hours."}</p>
<p><a href="${ctaHref}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">${ctaLabel}</a></p>
<p style="font-size:14px;color:#64748b">No middleman fees — call the pro you choose.${input.isGuest ? " Save your confirmation email — pros may reach you by phone." : ""}</p>
`);
  return { subject, html };
}

export function proApplicationEmail(input: { displayName: string; citySlug: string }) {
  const subject = "We received your ServeLocal listing application";
  const html = layout(`
<p>Hi ${input.displayName},</p>
<p>Thanks for applying to list on ServeLocal in <strong>${cityName(input.citySlug)}</strong>.</p>
<p>Our team reviews applications within <strong>1–2 business days</strong>. You’ll get another email when your listing is approved.</p>
<p><a href="${appUrl}/dashboard/pro" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Pro dashboard</a></p>
`);
  return { subject, html };
}

export function proApprovedEmail(input: { displayName: string; slug: string; citySlug: string }) {
  const subject = "Your ServeLocal listing is live";
  const html = layout(`
<p>Hi ${input.displayName},</p>
<p>Your listing is <strong>approved</strong> and visible to homeowners in ${cityName(input.citySlug)}.</p>
<p><a href="${appUrl}/pro/${input.slug}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">View your profile</a></p>
<p style="font-size:14px;color:#64748b">Upgrade to Featured (${FOUNDING_PRO.featuredPrice} founding rate) for top placement and job alerts when you&apos;re ready.</p>
`);
  return { subject, html };
}

export function jobLeadForProEmail(input: {
  proName: string;
  categoryName: string;
  citySlug: string;
  customerName: string;
  customerPhone: string;
  description: string;
  urgency?: string | null;
  budgetLabel?: string | null;
  isFeatured: boolean;
}) {
  const urgencyLine = input.urgency
    ? `<p><strong>Urgency:</strong> ${input.urgency.replace(/_/g, " ")}</p>`
    : "";
  const budgetLine = input.budgetLabel ? `<p><strong>Budget:</strong> ${input.budgetLabel}</p>` : "";
  const subject = `New ${input.categoryName} job in ${cityName(input.citySlug)} — ServeLocal`;
  const contactBlock = input.isFeatured
    ? `<p><strong>${input.customerName}</strong><br/>Phone: <a href="tel:${input.customerPhone}">${input.customerPhone}</a></p>`
    : `<p><strong>${input.customerName}</strong><br/>Phone: <em>Upgrade to Featured to unlock contact details</em></p>
<p><a href="${appUrl}/dashboard/pro/subscription" style="display:inline-block;background:#ea580c;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Upgrade — ${FOUNDING_PRO.featuredPrice}</a></p>`;
  const html = layout(`
<p>Hi ${input.proName},</p>
<p>A homeowner just posted a job that matches your listing${input.isFeatured ? " <strong>(Featured — priority alert)</strong>" : ""}:</p>
<p><strong>${input.categoryName}</strong> · ${cityName(input.citySlug)}</p>
${urgencyLine}
${budgetLine}
${contactBlock}
<p style="background:#f8fafc;padding:12px;border-radius:8px;font-size:14px">${input.description.slice(0, 500)}${input.description.length > 500 ? "…" : ""}</p>
<p>Call or text them direct — the homeowner chose pros from ServeLocal, not a shared lead auction.</p>
<p><a href="${appUrl}/dashboard/pro" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Pro dashboard</a></p>
`);
  return { subject, html };
}

export function savedSearchAlertEmail(input: {
  label: string;
  providerName: string;
  categoryName: string;
  citySlug: string;
  providerSlug: string;
}) {
  const subject = `New pro match: ${input.providerName} — ServeLocal`;
  const html = layout(`
<p>A new pro matches your saved search <strong>${input.label}</strong>:</p>
<p><strong>${input.providerName}</strong> · ${input.categoryName} · ${cityName(input.citySlug)}</p>
<p><a href="${appUrl}/pro/${input.providerSlug}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">View profile & call direct</a></p>
`);
  return { subject, html };
}

export function proUpgradedEmail(input: { proName: string; plan: string; amountLabel: string }) {
  const subject = "Your ServeLocal upgrade is active";
  const html = layout(`
<p>Hi ${input.proName},</p>
<p>Payment received — your listing is now on the <strong>${input.plan}</strong> plan (${input.amountLabel}).</p>
<p>You&apos;ll get priority job alerts, featured placement in search, and the verified badge on your profile.</p>
<p><a href="${appUrl}/dashboard/pro" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Pro dashboard</a></p>
<p style="font-size:14px;color:#64748b">Manage or cancel anytime from your dashboard billing link.</p>
`);
  return { subject, html };
}

export function adminProUpgradeEmail(input: {
  proName: string;
  plan: string;
  amountLabel: string;
  citySlug: string;
  providerSlug: string;
}) {
  const subject = `New ${input.plan} subscription — ${input.proName}`;
  const html = layout(`
<p><strong>${input.proName}</strong> upgraded to <strong>${input.plan}</strong> (${input.amountLabel}).</p>
<p>${cityName(input.citySlug)} · <a href="${appUrl}/pro/${input.providerSlug}">View profile</a> · <a href="${appUrl}/admin/listings">Admin listings</a></p>
`);
  return { subject, html };
}
