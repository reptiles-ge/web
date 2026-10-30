import * as Sentry from "@sentry/nextjs";

import { SENTRY_DSN } from "./src/lib/sentryDsn";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
});
