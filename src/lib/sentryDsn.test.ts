import { describe, expect, it } from "vitest";

import { SENTRY_DSN, sentrySecurityEndpoint } from "@/lib/sentryDsn";

describe("sentrySecurityEndpoint", () => {
  it("builds the security endpoint from the DSN", () => {
    expect(
      sentrySecurityEndpoint("https://key123@o1.ingest.us.sentry.io/42"),
    ).toBe(
      "https://o1.ingest.us.sentry.io/api/42/security/?sentry_environment=production&sentry_key=key123",
    );
  });

  it("follows the site DSN", () => {
    const dsn = new URL(SENTRY_DSN);
    const endpoint = new URL(sentrySecurityEndpoint(SENTRY_DSN));
    expect(endpoint.host).toBe(dsn.host);
    expect(endpoint.searchParams.get("sentry_key")).toBe(dsn.username);
    expect(endpoint.host.endsWith(".sentry.io")).toBe(true);
  });
});
