import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { BookingCheckout } from "@/components/booking/BookingCheckout";
import { FadeUp } from "@/components/motion/FadeUp";
import { getProviderBySlug } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({
    title: "Book & Pay",
    description: "Complete your booking with secure escrow payment on ServeLocal.",
    path: `/booking/${id}`,
  });
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // id can be provider slug for new bookings
  const provider = await getProviderBySlug(id);
  if (!provider) notFound();

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <FadeUp>
          <h1 className="font-display text-3xl font-black text-foreground">Book &amp; Pay</h1>
          <p className="mt-2 text-muted">
            Secure checkout with ServeLocal Guarantee — payment held until your job is done.
          </p>
        </FadeUp>
        <div className="mt-10">
          <BookingCheckout provider={provider} bookingId={id} />
        </div>
      </div>
    </MarketingPageShell>
  );
}
