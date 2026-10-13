import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

import {
  type ConfigHeader,
  securityHeaders,
  SITE_HEADERS_SOURCE,
  STRICT_TRANSPORT_SECURITY,
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
  it("sends a one-year HSTS without includeSubDomains or preload in production", () => {
    expect(headerValue(false, "Strict-Transport-Security")).toBe(
      "max-age=31536000",
    );
    expect(STRICT_TRANSPORT_SECURITY.value).not.toMatch(
      /includeSubDomains|preload/i,
    );
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

  it("sends HSTS on static assets served by Workers", () => {
    const rules = readFileSync(path.join(ROOT, "public/_headers"), "utf8");
    expect(rules).toMatch(
      /^\/\*\n {2}Strict-Transport-Security: max-age=31536000$/m,
    );
  });
});
