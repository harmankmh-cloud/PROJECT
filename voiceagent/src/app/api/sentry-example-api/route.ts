import * as Sentry from "@sentry/nextjs";

export async function GET() {
  Sentry.logger.info("Sentry example API invoked");

  throw new Error("Sentry Backend Example Error");
}

export const dynamic = "force-dynamic";
