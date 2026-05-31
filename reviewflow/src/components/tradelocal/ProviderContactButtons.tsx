"use client";

import type { ServiceProvider } from "@/lib/tradelocal/types";

export function ProviderContactButtons({ provider }: { provider: ServiceProvider }) {
  const phone = provider.phone.replace(/[^\d+]/g, "");
  const tel = phone.startsWith("+") ? phone : phone.length === 10 ? `+1${phone}` : phone;
  const wa = provider.whatsapp?.replace(/[^\d]/g, "") || phone.replace(/[^\d]/g, "");

  async function trackContact() {
    fetch(`/api/trade/contact/${provider.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId: provider.id }),
    }).catch(() => undefined);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={`tel:${tel}`}
        onClick={() => trackContact()}
        className="btn-gold flex-1 py-3.5 text-center"
      >
        Call {provider.phone}
      </a>
      {wa && (
        <a
          href={`https://wa.me/${wa.startsWith("1") ? wa : `1${wa}`}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackContact()}
          className="btn-ghost flex-1 py-3.5 text-center"
        >
          WhatsApp
        </a>
      )}
      {provider.email && (
        <a
          href={`mailto:${provider.email}`}
          onClick={() => trackContact()}
          className="btn-ghost flex-1 py-3.5 text-center"
        >
          Email
        </a>
      )}
    </div>
  );
}
