import { describe, expect, it } from "vitest";

import { getPublishedNewsArticles } from "@/data/news";
import { NO_CONTRIBUTORS } from "@/lib/contributorCredits";
import { getNewsVisual } from "@/lib/newsVisual";
import { loadNewsVisuals } from "@/lib/newsVisualLoader";

import {
  contributorDirectoryFixture,
  speciesCatalogFixture,
} from "../../tests/fixtures/speciesCatalog";
import { recordRequests } from "../../tests/msw/server";

const CATALOG_URL = "https://api.reptiles.ge/v1/catalog?view=card";
const CONTRIBUTORS_URL = "https://api.reptiles.ge/v1/contributors";

const article = getPublishedNewsArticles()[0]!;
const illustrated = {
  ...article,
  image: { alt: { ka: "ფოტო" }, src: "https://cdn.reptiles.ge/own.jpg" },
} as typeof article;
const atlasArticle = (speciesId: string) =>
  ({
    ...article,
    image: undefined,
    relatedRegionIds: [],
    relatedSpeciesIds: [speciesId],
  }) as unknown as typeof article;

async function load(articles: Parameters<typeof loadNewsVisuals>[0]) {
  const requests = recordRequests();
  const visuals = await loadNewsVisuals(articles, "en");
  requests.stop();
  return { urls: requests.urls, visuals };
}

describe("loadNewsVisuals", () => {
  it("makes no request when every article has its own image", async () => {
    const { urls, visuals } = await load([illustrated]);
    expect(urls).toEqual([]);
    expect(visuals[0]?.src).toBe("https://cdn.reptiles.ge/own.jpg");
  });

  it("loads only the catalog when the atlas photo has no photographer", async () => {
    const item = atlasArticle("elaphe-urartica");
    const { urls, visuals } = await load([item]);
    expect(urls).toEqual([CATALOG_URL]);
    expect(visuals).toEqual([
      getNewsVisual(item, "en", speciesCatalogFixture("en"), NO_CONTRIBUTORS),
    ]);
  });

  it("loads contributors once for credited atlas photos", async () => {
    const items = [
      atlasArticle("vipera-dinniki"),
      illustrated,
      atlasArticle("macrovipera-lebetina"),
    ];
    const { urls, visuals } = await load(items);
    expect(urls).toEqual([CATALOG_URL, CONTRIBUTORS_URL]);
    const catalog = speciesCatalogFixture("en");
    const contributors = contributorDirectoryFixture("en");
    expect(visuals).toEqual(
      items.map((item) => getNewsVisual(item, "en", catalog, contributors)),
    );
  });

  it("keeps empty slots in place", async () => {
    const { urls, visuals } = await load([undefined, illustrated, null]);
    expect(urls).toEqual([]);
    expect(visuals).toHaveLength(3);
    expect(visuals[0]).toBeNull();
    expect(visuals[1]?.src).toBe("https://cdn.reptiles.ge/own.jpg");
    expect(visuals[2]).toBeNull();
  });
});
