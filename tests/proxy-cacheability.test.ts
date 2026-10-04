import { NextRequest } from "next/server";
import assert from "node:assert/strict";
import test from "node:test";

import proxy from "../src/proxy";

for (const [path, rewrite] of [
  ["/", "https://reptiles.ge/ka"],
  ["/prinvelebi/saxeoebebi", "https://reptiles.ge/ka/birds/saxeoebebi"],
  ["/en/about", null],
  ["/ru/about", null],
  ["/tr/about", null],
] as const) {
  test(`${path} stays routable without request header overrides`, () => {
    const response = proxy(
      new NextRequest(`https://reptiles.ge${path}`, {
        headers: { accept: "text/html", "user-agent": "cacheability-test" },
      }),
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-middleware-rewrite"), rewrite);
    assert.equal(response.headers.has("x-middleware-override-headers"), false);
    assert.equal(
      [...response.headers.keys()].some((name) =>
        name.startsWith("x-middleware-request-"),
      ),
      false,
    );
  });
}

test("a supplied locale header stays out of the shared cache path", () => {
  const response = proxy(
    new NextRequest("https://reptiles.ge/en/about", {
      headers: { "x-next-intl-locale": "ka" },
    }),
  );

  assert.match(
    response.headers.get("x-middleware-override-headers") ?? "",
    /x-next-intl-locale/,
  );
  assert.equal(
    response.headers.get("x-middleware-request-x-next-intl-locale"),
    "en",
  );
});

test("incoming middleware protocol headers keep the shared cache bypass", () => {
  const response = proxy(
    new NextRequest("https://reptiles.ge/en/about", {
      headers: { "x-middleware-request-example": "external" },
    }),
  );

  assert.equal(response.headers.has("x-middleware-override-headers"), true);
});

test("prefixed Georgian URLs keep their canonical redirect", () => {
  const response = proxy(new NextRequest("https://reptiles.ge/ka/about"));

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "https://reptiles.ge/about");
});

for (const [path, robots] of [
  ["/species", null],
  ["/species?utm_source=x", null],
  ["/species?q=giurza", "noindex, follow"],
  ["/en/species?type=snake", "noindex, follow"],
  ["/gvelebi?q=giurza", null],
] as const) {
  test(`${path} robots header`, () => {
    const response = proxy(new NextRequest(`https://reptiles.ge${path}`));

    assert.equal(response.headers.get("x-robots-tag"), robots);
    assert.equal(response.headers.has("x-middleware-override-headers"), false);
  });
}
