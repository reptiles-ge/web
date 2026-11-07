import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type { HalyomorphaFieldRecord } from "@/lib/halyomorphaOccurrences";

import { server } from "../../../../../../tests/msw/server";
import { GET } from "./route";

const request = (id: string, locale: string) =>
  GET(new Request(`http://localhost/api/occurrences/${id}/${locale}`), {
    params: Promise.resolve({ id, locale }),
  });

describe("GET /api/occurrences/[id]/[locale]", () => {
  it("serves the records that fall in a region, in region order", async () => {
    const response = await request("natrix-natrix", "en");
    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
    const records = (await response.json()) as HalyomorphaFieldRecord[];
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((record) => record.regionId)).toBe(true);
  });

  it("serves no points for a species whose map hides them", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/species/:slug/range-map", () =>
        HttpResponse.json({
          data: {
            copy: {},
            hidePoints: true,
            iNaturalistTaxonId: 26017,
            rangeSource: "record-summary",
          },
          id: "natrix-natrix",
          locale: "en",
        }),
      ),
    );
    const response = await request("natrix-natrix", "en");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it("serves an empty list for a species without field records", async () => {
    const response = await request("bubo-bubo", "ka");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it("answers 404 for an unknown locale or species", async () => {
    for (const response of [
      await request("natrix-natrix", "de"),
      await request("no-such-species", "en"),
    ]) {
      expect(response.status).toBe(404);
      expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    }
  });
});
