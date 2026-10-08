import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getSpeciesById } from "@/data/species";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import {
  initialAtlasVisibleCount,
  nextAtlasVisibleCount,
} from "@/lib/atlasInfiniteScroll";
import { getFooterData } from "@/lib/footerData";
import { loadHalyomorphaOccurrences } from "@/lib/halyomorphaOccurrenceApi";
import {
  getOccurrenceSummary,
  hasFieldRecords,
} from "@/lib/occurrenceSummaries";
import { searchGroupHeading } from "@/lib/searchGroupHeading";
import {
  siteKeywords,
  speciesAliasKeywords,
  speciesJsonLdKeywords,
  speciesSeoAnchor,
  speciesSeoKeywords,
} from "@/lib/seoKeywords";
import { getSpeciesRiskChip, usesDangerScale } from "@/lib/speciesRisk";

import { recordRequests, server } from "../../tests/msw/server";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("atlas infinite scroll", () => {
  it("shows the first page, capped at the total", () => {
    expect(initialAtlasVisibleCount(100)).toBe(12);
    expect(initialAtlasVisibleCount(5)).toBe(5);
    expect(initialAtlasVisibleCount(0)).toBe(0);
    expect(initialAtlasVisibleCount(-3)).toBe(0);
    expect(initialAtlasVisibleCount(100, 30)).toBe(30);
  });

  it("loads one more page at a time without overshooting", () => {
    expect(nextAtlasVisibleCount(12, 100)).toBe(24);
    expect(nextAtlasVisibleCount(96, 100)).toBe(100);
    expect(nextAtlasVisibleCount(100, 100)).toBe(100);
    expect(nextAtlasVisibleCount(150, 100)).toBe(100);
    expect(nextAtlasVisibleCount(0, 0)).toBe(0);
    expect(nextAtlasVisibleCount(10, 100, 5)).toBe(15);
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
    const species = getSpeciesById("macrovipera-lebetina")!;
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
  it("lists every region and every venomous snake", () => {
    const data = getFooterData("en");
    expect(data.regions).toHaveLength(12);
    expect(data.venomous.map((item) => item.id)).toEqual(
      getVenomousCatalogSpecies().map((item) => item.id),
    );
    for (const region of data.regions) expect(region.name).toBeTruthy();
  });
});

describe("occurrence summaries", () => {
  it("returns an empty summary for a species without field records", () => {
    const summary = getOccurrenceSummary("no-such-species", "en");
    expect(summary.recordsByRegion).toEqual([]);
    expect(hasFieldRecords("no-such-species")).toBe(false);
  });

  it("returns regional counts for a species that has field records", () => {
    expect(hasFieldRecords("natrix-natrix")).toBe(true);
    const summary = getOccurrenceSummary("natrix-natrix", "en");
    expect(summary.recordsByRegion.length).toBeGreaterThan(0);
    for (const region of summary.recordsByRegion) {
      expect(region.count).toBeGreaterThan(0);
    }
  });

  it("names each region in the requested locale", () => {
    const summary = getOccurrenceSummary("halyomorpha-halys", "en");
    for (const region of summary.recordsByRegion ?? []) {
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

  it("fetches once per URL and flattens the region records", async () => {
    let calls = 0;
    server.use(
      http.get("http://site.test/data/occurrences/species-a/en.json", () => {
        calls += 1;
        return HttpResponse.json({
          regions: {
            imereti: { records: [{ id: 3 }] },
            kakheti: { records: [{ id: 1 }, { id: 2 }] },
          },
        });
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
      http.get("http://site.test/data/occurrences/species-b/ka.json", () => {
        calls += 1;
        return calls === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json({ regions: {} });
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
      http.get("http://site.test/data/occurrences/:id/ru.json", () =>
        HttpResponse.json({ regions: {} }),
      ),
    );
    await loadHalyomorphaOccurrences("a b", "ru", "x&y");
    requests.stop();
    expect(requests.urls[0]).toBe(
      "http://site.test/data/occurrences/a%20b/ru.json?v=x%26y",
    );
  });
});
