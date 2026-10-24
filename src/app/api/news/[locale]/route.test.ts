import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import type { NewsBrowserResult } from "@/lib/newsBrowserQuery";

import { getPublishedNewsArticles } from "@/data/news";

import en from "../../../../../messages/en.json";
import { GET } from "./route";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "nav" | "news" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

function get(locale: string, search = "") {
  const url = new URL(`https://reptiles.ge/api/news/${locale}${search}`);
  return GET(new Request(url), { params: Promise.resolve({ locale }) });
}

describe("GET /api/news/[locale]", () => {
  it("answers the first page of cards with topic counts and image entries", async () => {
    const response = await get("en");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=300, s-maxage=3600",
    );
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const body = (await response.json()) as NewsBrowserResult;
    const published = getPublishedNewsArticles("en");
    expect(body.total).toBe(published.length);
    expect(body.facets.hub.all).toBe(published.length);
    expect(body.items.map((item) => item.id)).toEqual(
      published.slice(0, 24).map((article) => article.slug),
    );
    for (const item of body.items) {
      expect(body.monthLabels[item.monthKey]).toBeTruthy();
    }
    for (const src of Object.keys(body.entries)) {
      expect(body.items.some((item) => item.entry.src === src)).toBe(true);
    }
  });

  it("filters by topic and search on the API", async () => {
    const [article] = getPublishedNewsArticles("en").filter(
      (item) => item.relatedHubIds.length > 0,
    );
    const hub = article!.relatedHubIds[0]!;
    const byHub = (await (
      await get("en", `?hub=${hub}`)
    ).json()) as NewsBrowserResult;
    expect(byHub.total).toBe(byHub.facets.hub[hub]);
    expect(byHub.items.every((item) => item.id)).toBe(true);

    const word = article!.copy.en.title
      .split(" ")
      .find((part) => part.length > 5)!;
    const searched = (await (
      await get("en", `?q=${encodeURIComponent(word)}`)
    ).json()) as NewsBrowserResult;
    expect(searched.items.map((item) => item.id)).toContain(article!.slug);
    expect(searched.facets.hub.all).toBe(searched.total);
  });

  it("refuses bad queries, pages past the end and unknown locales", async () => {
    for (const search of [
      "?hub=fish",
      "?page=0",
      "?page=x",
      `?q=${"a".repeat(101)}`,
    ]) {
      expect((await get("en", search)).status, search).toBe(400);
    }
    expect((await get("en", "?page=999")).status).toBe(404);
    expect((await get("xx")).status).toBe(404);
  });
});
