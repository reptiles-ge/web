import { describe, expect, it, vi } from "vitest";

import sitemap from "./sitemap";

vi.mock("@/i18n/navigation", async () => {
  const { fakeGetPathname } = await import("../../tests/fixtures/manyNews");
  return { getPathname: fakeGetPathname };
});

vi.mock("@/data/news", async (importOriginal) => {
  const { withManyNews } = await import("../../tests/fixtures/manyNews");
  return withManyNews(await importOriginal());
});

describe("sitemap news archive", () => {
  const entries = sitemap();
  const archive = entries.filter((entry) => entry.url.includes("/news/page/"));

  it("lists every archive page that has articles, and none beyond", () => {
    expect(archive.map((entry) => entry.url).sort()).toEqual(
      [
        "https://reptiles.ge/en/news/page/2",
        "https://reptiles.ge/en/news/page/3",
        "https://reptiles.ge/news/page/2",
        "https://reptiles.ge/news/page/3",
        "https://reptiles.ge/ru/news/page/2",
        "https://reptiles.ge/ru/news/page/3",
        "https://reptiles.ge/tr/news/page/2",
      ].sort(),
    );
  });

  it("dates every archive page and lists only locales that have it", () => {
    for (const entry of archive) {
      expect(
        Number.isNaN(Date.parse(String(entry.lastModified))),
        entry.url,
      ).toBe(false);
    }
    const third = archive.find(
      (entry) => entry.url === "https://reptiles.ge/news/page/3",
    );
    expect(Object.keys(third?.alternates?.languages ?? {}).sort()).toEqual([
      "en",
      "ka",
      "ru",
      "x-default",
    ]);
  });
});
