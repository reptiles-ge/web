import { createTranslator } from "next-intl";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  getPublishedNewsArticleBySlug,
  getPublishedNewsArticles,
} from "@/data/news";
import { createAdminNews, publishAdminNews } from "@/lib/adminNewsApi";
import { llmsFileResponse } from "@/lib/llmsResponse";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import {
  REPTILES_API_TEST_TOKEN,
  resetReptilesApi,
} from "../../tests/msw/reptilesApi";
import { GET as getSearchIndex } from "./api/search/[locale]/route";
import { GET as getFeed } from "./feed.xml/route";
import { GET as getLlmsFull } from "./llms-full.txt/route";
import { GET as getLlmsIndex } from "./llms.txt/route";
import sitemap from "./sitemap";

const messages = { en, ka, ru, tr };
const slug = "d1-only-news";

vi.mock("@/i18n/navigation", async () => {
  const { fakeGetPathname } = await import("../../tests/fixtures/manyNews");
  return { getPathname: fakeGetPathname };
});

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "news";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

beforeAll(async () => {
  resetReptilesApi();
  vi.stubEnv("API_WRITE_TOKEN", REPTILES_API_TEST_TOKEN);
  const article = {
    ...getPublishedNewsArticles()[0]!,
    id: slug,
    publishedAt: "2026-12-01",
    slug,
  };
  const options = { actor: "test", summary: `Import ${slug}` };
  await createAdminNews(article, { ...options, dryRun: false });
  await publishAdminNews(slug, { actor: "test", expectedVersion: 1 });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("a news article that exists only in D1", () => {
  it("is not in the compiled news registry", () => {
    expect(getPublishedNewsArticleBySlug(slug)).toBeUndefined();
  });

  it("is in the sitemap in every locale it has", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const url of [
      `https://reptiles.ge/news/${slug}`,
      `https://reptiles.ge/en/news/${slug}`,
      `https://reptiles.ge/ru/news/${slug}`,
      `https://reptiles.ge/tr/news/${slug}`,
    ]) {
      expect(urls).toContain(url);
    }
  });

  it("is in the Atom feed", async () => {
    expect(await (await getFeed()).text()).toContain(
      `<id>https://reptiles.ge/news/${slug}</id>`,
    );
  });

  it("is in the llms files", async () => {
    expect(await (await getLlmsIndex()).text()).toContain(`/news/${slug})`);
    expect(await (await getLlmsFull()).text()).toContain(
      `- URL: https://reptiles.ge/news/${slug}`,
    );
    expect(await (await llmsFileResponse("index", "en")).text()).toContain(
      `/en/news/${slug})`,
    );
  });

  it("is in the site search index", async () => {
    const response = await getSearchIndex(new Request("https://reptiles.ge"), {
      params: Promise.resolve({ locale: "ka" }),
    });
    const keys = ((await response.json()) as Array<{ key: string }>).map(
      (doc) => doc.key,
    );
    expect(keys).toContain(`news:${slug}`);
  });
});
