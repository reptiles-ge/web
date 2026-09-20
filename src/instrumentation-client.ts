import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6db3fcbf0eebe4b852d9498135a5678f@o4510170297073664.ingest.us.sentry.io/4512117330608128",
  tracesSampleRate: 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
