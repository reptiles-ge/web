import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NEWS_ARTICLES } from "@/data/news.generated";

import {
  REPTILES_API_TEST_TOKEN,
  resetReptilesApi,
} from "../../tests/msw/reptilesApi";
import { createAdminNews, publishAdminNews } from "./adminNewsApi";

const fresh = { ...NEWS_ARTICLES[0]!, id: "test-news", slug: "test-news" };
const options = { actor: "test", summary: "Import test-news" };

beforeEach(() => {
  resetReptilesApi();
  vi.stubEnv("API_WRITE_TOKEN", REPTILES_API_TEST_TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin news API", () => {
  it("checks, creates and publishes an article", async () => {
    expect(await createAdminNews(fresh, { ...options, dryRun: true })).toEqual({
      dryRun: true,
      id: "test-news",
      status: "draft",
      version: null,
    });
    const created = await createAdminNews(fresh, { ...options, dryRun: false });
    expect(created).toEqual({
      dryRun: false,
      id: "test-news",
      status: "draft",
      version: 1,
    });
    expect(
      await publishAdminNews("test-news", {
        actor: "test",
        expectedVersion: 1,
      }),
    ).toEqual({ id: "test-news", status: "published", version: 2 });
  });

  it("reports the API's problems with their paths", async () => {
    await expect(
      createAdminNews(
        { ...fresh, relatedSpeciesIds: ["no-such-species"] },
        { ...options, dryRun: true },
      ),
    ).rejects.toThrow(
      "Article links to unknown ids\n  article.relatedSpeciesIds: Unknown species no-such-species",
    );
    await expect(
      createAdminNews(NEWS_ARTICLES[0]!, { ...options, dryRun: true }),
    ).rejects.toThrow("Article already exists");
  });

  it("needs the write token", async () => {
    vi.stubEnv("API_WRITE_TOKEN", "");
    await expect(
      createAdminNews(fresh, { ...options, dryRun: true }),
    ).rejects.toThrow("API_WRITE_TOKEN is not set");
  });
});
