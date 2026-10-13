import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  REVALIDATED_ASSET_CACHE_CONTROL,
  SITEMAP_CACHE_CONTROL,
  withResponseCacheControl,
} from "@/lib/responseCacheControl";

const VINEXT_DEFAULT = "private, max-age=0, must-revalidate";

function vinextResponse(status = 200) {
  return new Response("body", {
    headers: { "Cache-Control": VINEXT_DEFAULT, "Content-Type": "image/png" },
    status,
  });
}

describe("withResponseCacheControl", () => {
  it.each([
    ["/favicon.ico", REVALIDATED_ASSET_CACHE_CONTROL],
    ["/icon.png?b6384270b2a1c2e3", REVALIDATED_ASSET_CACHE_CONTROL],
    ["/apple-icon.png", REVALIDATED_ASSET_CACHE_CONTROL],
    ["/sitemap.xml", SITEMAP_CACHE_CONTROL],
  ])("gives %s a shared cache", async (url, expected) => {
    const response = withResponseCacheControl(
      new Request(`https://reptiles.ge${url}`),
      vinextResponse(),
    );
    expect(response.headers.get("Cache-Control")).toBe(expected);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("body");
  });

  it("answers HEAD requests with the same header", () => {
    const response = withResponseCacheControl(
      new Request("https://reptiles.ge/sitemap.xml", { method: "HEAD" }),
      vinextResponse(),
    );
    expect(response.headers.get("Cache-Control")).toBe(SITEMAP_CACHE_CONTROL);
  });

  it.each([
    ["page", "https://reptiles.ge/gvelebi", "GET", 200],
    ["error", "https://reptiles.ge/favicon.ico", "GET", 503],
    ["non-GET", "https://reptiles.ge/sitemap.xml", "POST", 200],
    ["locale-prefixed icon", "https://reptiles.ge/en/icon.png", "GET", 200],
  ])("leaves a %s response alone", (_, url, method, status) => {
    const original = vinextResponse(status);
    const response = withResponseCacheControl(
      new Request(url, { method }),
      original,
    );
    expect(response).toBe(original);
    expect(response.headers.get("Cache-Control")).toBe(VINEXT_DEFAULT);
  });

  it("is applied by the Worker entry", () => {
    const worker = readFileSync(
      path.resolve(__dirname, "../worker.ts"),
      "utf8",
    );
    expect(worker).toContain("withResponseCacheControl(");
  });
});

describe("public/_headers", () => {
  const headers = readFileSync(
    path.resolve(__dirname, "../../public/_headers"),
    "utf8",
  );

  function rule(pattern: string) {
    const lines = headers.split("\n");
    const start = lines.indexOf(pattern);
    if (start === -1) return [];
    const body: string[] = [];
    for (const line of lines.slice(start + 1)) {
      if (!line.startsWith(" ")) break;
      body.push(line.trim());
    }
    return body;
  }

  it.each(["/images/*", "/apple-touch-icon.png"])(
    "revalidates %s weekly instead of on every view",
    (pattern) => {
      expect(rule(pattern)).toContain(
        `Cache-Control: ${REVALIDATED_ASSET_CACHE_CONTROL}`,
      );
    },
  );

  it("keeps immutable caching for content-hashed build output only", () => {
    const immutable = headers
      .split("\n")
      .filter((line) => line.includes("immutable"));
    expect(immutable).toHaveLength(2);
    expect(rule("/_next/static/*")).toContain(
      "Cache-Control: public, max-age=31536000, immutable",
    );
  });
});
