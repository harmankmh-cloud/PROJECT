import { sendTransactionalEmail } from "@/lib/email";
import { adminProUpgradeEmail, proUpgradedEmail } from "@/lib/email-templates";
import { getProviderById } from "@/lib/data";
import { LISTING_PLANS } from "@/lib/constants";

function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function planLabel(plan?: string | null) {
  const tier = plan === "premium" ? "premium" : "featured";
  return LISTING_PLANS.find((p) => p.id === tier)?.name || (tier === "premium" ? "Premium Elite" : "Featured Pro");
}

function amountLabel(plan?: string | null) {
  if (plan === "premium") return "$99/mo";
  return "$29/mo founding";
}

export async function notifyProUpgradeEmails(providerId: string, plan?: string | null) {
  const provider = await getProviderById(providerId);
  if (!provider) return;

  const planName = planLabel(plan);
  const amount = amountLabel(plan);
  const proEmail = provider.email?.trim();

  if (proEmail) {
    const { subject, html } = proUpgradedEmail({
      proName: provider.display_name,
      plan: planName,
      amountLabel: amount,
    });
    await sendTransactionalEmail({ to: proEmail, subject, html, template: "pro_upgraded" });
  }

  const admins = adminEmails();
  if (admins.length === 0) return;

  const { subject, html } = adminProUpgradeEmail({
    proName: provider.display_name,
    plan: planName,
    amountLabel: amount,
    citySlug: provider.city_slug,
    providerSlug: provider.slug,
  });

  await Promise.all(
    admins.map((to) => sendTransactionalEmail({ to, subject, html, template: "admin_pro_upgrade" }))
  );
}
