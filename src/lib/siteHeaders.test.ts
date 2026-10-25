import { describe, expect, it } from "vitest";

import { llmsLinkHeader } from "@/lib/llmsPaths";

import nextConfig from "../../next.config";
import { matchHeaders } from "../../node_modules/vinext/dist/config/config-matchers.js";

async function headerFor(pathname: string, key: string) {
  const rules = await nextConfig.headers!();
  const matched = matchHeaders(pathname, rules as never, {} as never);
  return matched.filter((header) => header.key === key).at(-1)?.value;
}

describe("site headers", () => {
  it.each([
    ["/", "ka"],
    ["/gvelebi", "ka"],
    ["/en", "en"],
    ["/en/species", "en"],
    ["/ru", "ru"],
    ["/ru/snakes", "ru"],
    ["/tr", "tr"],
    ["/tr/lizards", "tr"],
  ] as const)(
    "advertises the %s llms files of its locale",
    async (path, locale) => {
      expect(await headerFor(path, "Link")).toBe(llmsLinkHeader(locale));
    },
  );

  it("sends the security headers on every page", async () => {
    for (const path of ["/", "/en", "/species"]) {
      expect(await headerFor(path, "Permissions-Policy"), path).toBe(
        "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      );
      expect(await headerFor(path, "Cross-Origin-Opener-Policy"), path).toBe(
        "same-origin",
      );
    }
  });
});
