import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import proxy from "@/proxy";

function call(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(`https://reptiles.ge${path}`, { headers }));
}

describe("proxy cacheability", () => {
  it.each([
    ["/", "https://reptiles.ge/ka"],
    ["/prinvelebi/saxeoebebi", "https://reptiles.ge/ka/birds/saxeoebebi"],
    ["/en/about", null],
    ["/ru/about", null],
    ["/tr/about", null],
  ])("%s stays routable without request header overrides", (path, rewrite) => {
    const response = call(path, {
      accept: "text/html",
      "user-agent": "cacheability-test",
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-rewrite")).toBe(rewrite);
    expect(response.headers.has("x-middleware-override-headers")).toBe(false);
    expect(
      [...response.headers.keys()].filter((name) =>
        name.startsWith("x-middleware-request-"),
      ),
    ).toEqual([]);
  });

  it("keeps a supplied locale header out of the shared cache path", () => {
    const response = call("/en/about", { "x-next-intl-locale": "ka" });

    expect(response.headers.get("x-middleware-override-headers")).toMatch(
      /x-next-intl-locale/,
    );
    expect(
      response.headers.get("x-middleware-request-x-next-intl-locale"),
    ).toBe("en");
  });

  it("keeps the shared cache bypass for incoming middleware protocol headers", () => {
    const response = call("/en/about", {
      "x-middleware-request-example": "external",
    });

    expect(response.headers.has("x-middleware-override-headers")).toBe(true);
  });

  it("keeps the canonical redirect for prefixed Georgian URLs", () => {
    const response = call("/ka/about");

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://reptiles.ge/about");
  });

  it.each([
    ["/species", null],
    ["/species?utm_source=x", null],
    ["/species?q=giurza", null],
    ["/en/species?type=snake", null],
    ["/gvelebi?q=giurza", null],
  ])("sets the %s robots header without overrides", (path, robots) => {
    const response = call(path);

    expect(response.headers.get("x-robots-tag")).toBe(robots);
    expect(response.headers.has("x-middleware-override-headers")).toBe(false);
  });
});
