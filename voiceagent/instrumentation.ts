export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    });
  } catch {
    // Sentry optional — build succeeds without @sentry/nextjs when DSN unset
  }
}

export async function onRequestError(
  error: Error,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string }
) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      extra: { request, context },
    });
  } catch {
    // fail open
  }
}
