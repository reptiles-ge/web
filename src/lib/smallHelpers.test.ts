import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { pickVenomousSnakes, summarizeAtlas } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { atlasPageCount, atlasPageRange } from "@/lib/atlasPages";
import { getFooterData } from "@/lib/footerData";
import { loadHalyomorphaOccurrences } from "@/lib/halyomorphaOccurrenceApi";
import { getOccurrenceSummary } from "@/lib/occurrenceSummaries";
import { searchGroupHeading } from "@/lib/searchGroupHeading";
import {
  siteKeywords,
  speciesAliasKeywords,
  speciesJsonLdKeywords,
  speciesSeoAnchor,
  speciesSeoKeywords,
} from "@/lib/seoKeywords";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { getSpeciesFieldRecords } from "@/lib/speciesFieldRecordsApi";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";

import { speciesFixture } from "../../tests/fixtures/speciesCatalog";
import { recordRequests, server } from "../../tests/msw/server";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("atlas pages", () => {
  it("counts pages of the filtered list", () => {
    expect(atlasPageCount(145)).toBe(7);
    expect(atlasPageCount(24)).toBe(1);
    expect(atlasPageCount(25)).toBe(2);
    expect(atlasPageCount(0)).toBe(0);
    expect(atlasPageCount(-3)).toBe(0);
    expect(atlasPageCount(10, 5)).toBe(2);
  });

  it("gives the slice of a page, clamped to the last page", () => {
    expect(atlasPageRange(1, 145)).toEqual({ first: 1, last: 24, page: 1 });
    expect(atlasPageRange(7, 145)).toEqual({ first: 145, last: 145, page: 7 });
    expect(atlasPageRange(9, 30)).toEqual({ first: 25, last: 30, page: 2 });
    expect(atlasPageRange(0, 30)).toEqual({ first: 1, last: 24, page: 1 });
    expect(atlasPageRange(1, 0)).toEqual({ first: 0, last: 0, page: 1 });
    expect(atlasPageRange(2, 10, 5)).toEqual({ first: 6, last: 10, page: 2 });
  });
});

describe("searchGroupHeading", () => {
  const titles = {
    featured: "Featured",
    pages: "Pages",
    recent: "Recent",
    regions: "Regions",
    species: "Species",
    suggested: "Suggested",
  };

  it("labels recent searches first", () => {
    expect(searchGroupHeading("species", true, "viper", titles)).toBe("Recent");
  });

  it("uses suggested/featured when nothing is typed", () => {
    expect(searchGroupHeading("page", false, "", titles)).toBe("Suggested");
    expect(searchGroupHeading("species", false, "", titles)).toBe("Featured");
    expect(searchGroupHeading("region", false, "", titles)).toBe("Regions");
  });

  it("uses plain group names once the user types", () => {
    expect(searchGroupHeading("page", false, "x", titles)).toBe("Pages");
    expect(searchGroupHeading("species", false, "x", titles)).toBe("Species");
    expect(searchGroupHeading("region", false, "x", titles)).toBe("Regions");
  });
});

describe("species risk", () => {
  it("shows the danger scale only for groups with a venom concept", () => {
    expect(usesDangerScale("snake")).toBe(true);
    expect(usesDangerScale("bird")).toBe(false);
  });

  it("returns a chip for a rated snake", () => {
    expect(
      getSpeciesRiskChip({ danger: "High", id: "macrovipera-lebetina" }),
    ).toEqual({ kind: "danger", level: "High" });
  });

  it("returns no chip without a rating or for a group without the scale", () => {
    expect(
      getSpeciesRiskChip({ danger: undefined, id: "natrix-natrix" }),
    ).toBeNull();
    expect(
      getSpeciesRiskChip({ danger: "Harmless", id: "falco-peregrinus" }),
    ).toBeNull();
  });

  it("honours an explicit group override", () => {
    expect(
      getSpeciesRiskChip({ danger: "High", id: "falco-peregrinus" }, "snake"),
    ).toEqual({ kind: "danger", level: "High" });
  });
});

describe("seoKeywords", () => {
  it("has site keywords for every locale", () => {
    for (const locale of routing.locales) {
      expect(siteKeywords(locale).length, locale).toBeGreaterThan(2);
    }
  });

  it("returns aliases per locale, and nothing for unknown species", () => {
    expect(speciesAliasKeywords("no-such-species", "en")).toEqual([]);
    expect(
      speciesAliasKeywords("macrovipera-lebetina", "ka").length,
    ).toBeGreaterThan(0);
    expect(
      speciesAliasKeywords("macrovipera-lebetina", "en").length,
    ).toBeGreaterThan(0);
  });

  it("builds a de-duplicated, trimmed keyword list for a species", () => {
    const species = speciesFixture("macrovipera-lebetina")!;
    const keywords = speciesSeoKeywords(species, "en");
    expect(keywords).toContain(species.scientificName);
    expect(keywords).toContain("Georgia");
    const lower = keywords.map((keyword) => keyword.toLowerCase());
    expect(new Set(lower).size).toBe(lower.length);
    expect(keywords.every((keyword) => keyword === keyword.trim())).toBe(true);
    expect(speciesJsonLdKeywords(species, "en")).toBe(keywords.join(", "));
  });

  it("formats the SEO anchor", () => {
    expect(speciesSeoAnchor("Grass snake", "Natrix natrix")).toBe(
      "Grass snake (Natrix natrix)",
    );
  });
});

describe("getFooterData", () => {
  it("lists every region and every venomous snake", async () => {
    const catalog = await getSpeciesCatalog("en");
    const data = await getFooterData("en");
    expect(data.regions).toHaveLength(12);
    expect(data.venomous.map((item) => item.id)).toEqual(
      pickVenomousSnakes(catalog).map((item) => item.id),
    );
    expect(data.venomous.length).toBeGreaterThan(0);
    expect(data.stats).toEqual(summarizeAtlas(catalog));
    for (const region of data.regions) expect(region.name).toBeTruthy();
  });

  it("asks the catalog only for limited pages", async () => {
    const requests = recordRequests();
    await getFooterData("ka");
    requests.stop();
    const catalogUrls = requests.urls.filter((url) =>
      url.includes("/v1/catalog"),
    );
    expect(catalogUrls.length).toBeGreaterThan(0);
    for (const url of catalogUrls) {
      expect(new URL(url).searchParams.get("limit"), url).toBeTruthy();
    }
  });
});

describe("occurrence summaries", () => {
  const summaryFor = async (id: string) => {
    const species = speciesFixture(id)!;
    return getOccurrenceSummary({
      fieldRecords: await getSpeciesFieldRecords(id),
      gallery: species.gallery,
      locale: "en",
      speciesId: id,
      speciesName: species.commonName,
    });
  };

  it("returns an empty summary for a species without field records", async () => {
    expect(await getSpeciesFieldRecords("no-such-species")).toEqual([]);
    const summary = await summaryFor("bubo-bubo");
    expect(summary.totalRecords).toBe(0);
    expect(summary.recordsByRegion).toEqual([]);
  });

  it("returns regional counts for a species that has field records", async () => {
    const summary = await summaryFor("natrix-natrix");
    expect(summary.recordsByRegion.length).toBeGreaterThan(0);
    for (const region of summary.recordsByRegion) {
      expect(region.count).toBeGreaterThan(0);
    }
  });

  it("names each region in the requested locale", async () => {
    const summary = await summaryFor("halyomorpha-halys");
    for (const region of summary.recordsByRegion) {
      expect(region.name).toBeTruthy();
    }
  });
});

describe("loadHalyomorphaOccurrences", () => {
  beforeEach(() => {
    const interceptedFetch = globalThis.fetch;
    vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit) =>
      interceptedFetch(
        typeof input === "string" ? new URL(input, "http://site.test") : input,
        init,
      ),
    );
  });

  it("fetches the records once per URL", async () => {
    let calls = 0;
    server.use(
      http.get("http://site.test/api/occurrences/species-a/en", () => {
        calls += 1;
        return HttpResponse.json([{ id: 1 }, { id: 2 }, { id: 3 }]);
      }),
    );
    const first = await loadHalyomorphaOccurrences("species-a", "en", "r1");
    const second = await loadHalyomorphaOccurrences("species-a", "en", "r1");
    expect(first).toHaveLength(3);
    expect(second).toBe(first);
    expect(calls).toBe(1);
  });

  it("forgets a failed request so it can be retried", async () => {
    let calls = 0;
    server.use(
      http.get("http://site.test/api/occurrences/species-b/ka", () => {
        calls += 1;
        return calls === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json([]);
      }),
    );
    await expect(
      loadHalyomorphaOccurrences("species-b", "ka", "r1"),
    ).rejects.toThrow("Occurrence request failed");
    await expect(
      loadHalyomorphaOccurrences("species-b", "ka", "r1"),
    ).resolves.toEqual([]);
    expect(calls).toBe(2);
  });

  it("encodes the species id and revision in the URL", async () => {
    const requests = recordRequests();
    server.use(
      http.get("http://site.test/api/occurrences/:id/ru", () =>
        HttpResponse.json([]),
      ),
    );
    await loadHalyomorphaOccurrences("a b", "ru", "x&y");
    requests.stop();
    expect(requests.urls[0]).toBe(
      "http://site.test/api/occurrences/a%20b/ru?v=x%26y",
    );
  });
});
