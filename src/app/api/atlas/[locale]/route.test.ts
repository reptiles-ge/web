import { describe, expect, it } from "vitest";

import { ATLAS_PAGE_SIZE } from "@/lib/atlasPages";

import { GET } from "./route";

type Body = {
  entries?: Record<string, { path: string }>;
  facets: { group: Record<string, number> };
  items?: Array<{ id: string; image: string; mobileImage?: string }>;
  page?: number;
  total: number;
};

function get(locale: string, search = "") {
  const url = new URL(`https://reptiles.ge/api/atlas/${locale}${search}`);
  return GET(new Request(url), { params: Promise.resolve({ locale }) });
}

describe("GET /api/atlas/[locale]", () => {
  it("answers a page of cards with counts and image entries", async () => {
    const response = await get("ka", "?page=2");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=300, s-maxage=3600",
    );
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const body = (await response.json()) as Body;
    expect(body.page).toBe(2);
    expect(body.items).toHaveLength(ATLAS_PAGE_SIZE);
    expect(body.facets.group.all).toBe(body.total);
    for (const src of Object.keys(body.entries ?? {})) {
      expect(
        body.items!.some(
          (item) => item.image === src || item.mobileImage === src,
        ),
      ).toBe(true);
    }
  });

  it("answers only the counts for a filter preview", async () => {
    const response = await get("en", "?group=snake&counts=1");
    const body = (await response.json()) as Body;
    expect(body.total).toBe(body.facets.group.snake);
    expect(body).not.toHaveProperty("items");
  });

  it("rejects an unknown locale or filter", async () => {
    expect((await get("de")).status).toBe(404);
    for (const search of [
      "?group=fish",
      "?region=paris",
      "?sort=random",
      "?page=0",
      `?q=${"a".repeat(101)}`,
    ]) {
      expect((await get("ka", search)).status).toBe(400);
    }
  });
});
