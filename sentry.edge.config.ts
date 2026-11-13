import * as Sentry from "@sentry/nextjs";

import { SENTRY_DSN } from "./src/lib/sentryDsn";

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
});
