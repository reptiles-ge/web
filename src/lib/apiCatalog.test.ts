import { describe, expect, it } from "vitest";

import { GET } from "@/app/.well-known/api-catalog/route";
import { API_CATALOG_CONTENT_TYPE, buildApiCatalog } from "@/lib/apiCatalog";
import { apiDiscoveryLinkHeader } from "@/lib/apiDocsPaths";

describe("buildApiCatalog", () => {
  it("lists the API with its OpenAPI description and reference", () => {
    expect(buildApiCatalog()).toEqual({
      linkset: [
        {
          anchor: "https://api.reptiles.ge/v1",
          "service-desc": [
            {
              href: "https://reptiles.ge/v1/docs/openapi.json",
              type: "application/vnd.oai.openapi+json",
            },
          ],
          "service-doc": [
            { href: "https://reptiles.ge/docs", type: "text/html" },
          ],
          "service-meta": [
            { href: "https://reptiles.ge/developers", type: "text/html" },
          ],
        },
      ],
    });
  });
});

describe("GET /.well-known/api-catalog", () => {
  it("serves the linkset with the RFC 9727 profile", async () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toBe(API_CATALOG_CONTENT_TYPE);
    expect(await response.json()).toEqual(buildApiCatalog());
  });
});

describe("apiDiscoveryLinkHeader", () => {
  it("names the spec, the reference and the catalog", () => {
    expect(apiDiscoveryLinkHeader()).toBe(
      [
        '</v1/docs/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
        '</docs>; rel="service-doc"; type="text/html"',
        '</.well-known/api-catalog>; rel="api-catalog"',
      ].join(", "),
    );
  });
});
