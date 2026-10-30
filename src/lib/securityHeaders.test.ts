import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

import {
  type ConfigHeader,
  CSP_REPORT_GROUP,
  CSP_REPORT_URI,
  scriptSourceOrigins,
  securityHeaders,
  SITE_HEADERS_SOURCE,
  STRICT_TRANSPORT_SECURITY,
  withScriptNonce,
} from "@/lib/securityHeaders";

type MatchHeaders = (
  pathname: string,
  rules: { headers: ConfigHeader[]; source: string }[],
  context: {
    cookies: Record<string, string>;
    headers: Headers;
    host: string;
    query: URLSearchParams;
  },
) => ConfigHeader[];

const ROOT = path.resolve(__dirname, "../..");

function headerValue(isDevelopment: boolean, key: string) {
  return securityHeaders(isDevelopment).find((header) => header.key === key)
    ?.value;
}

async function vinextMatchHeaders(): Promise<MatchHeaders> {
  const matchers = (await import(
    pathToFileURL(
      path.join(ROOT, "node_modules/vinext/dist/config/config-matchers.js"),
    ).href
  )) as { matchHeaders: MatchHeaders };
  return matchers.matchHeaders;
}

describe("securityHeaders", () => {
  it("sends a one-year HSTS with includeSubDomains and without preload in production", () => {
    expect(headerValue(false, "Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains",
    );
    expect(STRICT_TRANSPORT_SECURITY.value).not.toMatch(/preload/i);
  });

  it("keeps HSTS and X-Frame-Options out of local development", () => {
    expect(headerValue(true, "Strict-Transport-Security")).toBeUndefined();
    expect(headerValue(true, "X-Frame-Options")).toBeUndefined();
  });

  it("keeps the existing security headers", () => {
    expect(headerValue(false, "X-Content-Type-Options")).toBe("nosniff");
    expect(headerValue(false, "Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headerValue(false, "X-Frame-Options")).toBe("DENY");
    expect(headerValue(false, "Content-Security-Policy")).toContain(
      "frame-ancestors 'none'",
    );
  });

  it("reports CSP violations to Sentry in production only", () => {
    const directives = headerValue(false, "Content-Security-Policy")!.split(
      "; ",
    );
    expect(directives).toContain(`report-uri ${CSP_REPORT_URI}`);
    expect(directives).toContain(`report-to ${CSP_REPORT_GROUP}`);
    expect(headerValue(false, "Reporting-Endpoints")).toBe(
      `${CSP_REPORT_GROUP}="${CSP_REPORT_URI}"`,
    );
    expect(new URL(CSP_REPORT_URI).pathname).toMatch(/\/security\/$/);
    expect(headerValue(true, "Content-Security-Policy")).not.toMatch(
      /report-(uri|to)/,
    );
    expect(headerValue(true, "Reporting-Endpoints")).toBeUndefined();
  });

  it("keeps the report directives through the script nonce rewrite", () => {
    const policy = withScriptNonce(
      headerValue(false, "Content-Security-Policy")!,
      "abc",
    );
    expect(policy).toContain(`report-uri ${CSP_REPORT_URI}`);
    expect(policy).toContain(`report-to ${CSP_REPORT_GROUP}`);
  });

  it("allows eval only in local development", () => {
    expect(headerValue(false, "Content-Security-Policy")).not.toContain(
      "'unsafe-eval'",
    );
    expect(headerValue(true, "Content-Security-Policy")).toContain(
      "'unsafe-eval'",
    );
  });

  it("swaps unsafe-inline for a nonce and strict-dynamic in script-src only", () => {
    const policy = withScriptNonce(
      headerValue(false, "Content-Security-Policy")!,
      "abc",
    );
    const directives = policy.split("; ");
    const scriptSrc = directives.find((value) =>
      value.startsWith("script-src "),
    )!;

    expect(scriptSrc).toMatch(/^script-src 'self' https:/);
    expect(scriptSrc).toMatch(/ 'nonce-abc' 'strict-dynamic'$/);
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(directives).toContain("style-src 'self' 'unsafe-inline'");
    expect(directives).toContain("frame-ancestors 'none'");
  });

  it("lists the exact script origins without wildcards or keywords", () => {
    expect(
      scriptSourceOrigins(headerValue(false, "Content-Security-Policy")!),
    ).toEqual([
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://ssl.google-analytics.com",
    ]);
    expect(scriptSourceOrigins("default-src 'self'")).toEqual([]);
  });

  it.each(["/", "/gvelebi", "/en", "/en/snakes/macrovipera-lebetina"])(
    "applies the site-wide rule to %s on vinext",
    async (pathname) => {
      const matchHeaders = await vinextMatchHeaders();
      const matched = matchHeaders(
        pathname,
        [{ headers: securityHeaders(false), source: SITE_HEADERS_SOURCE }],
        {
          cookies: {},
          headers: new Headers(),
          host: "reptiles.ge",
          query: new URLSearchParams(),
        },
      );
      expect(matched.map((header) => header.key)).toContain(
        "Strict-Transport-Security",
      );
    },
  );

  it.each(["public/_headers", "src/admin/public/_headers"])(
    "sends the site HSTS on static assets in %s",
    (file) => {
      const rules = readFileSync(path.join(ROOT, file), "utf8");
      expect(rules.split("\n")).toContain(
        `  Strict-Transport-Security: ${STRICT_TRANSPORT_SECURITY.value}`,
      );
    },
  );
});
