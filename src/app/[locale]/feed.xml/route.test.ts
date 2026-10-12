import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import en from "../../../../messages/en.json";
import ka from "../../../../messages/ka.json";
import ru from "../../../../messages/ru.json";
import tr from "../../../../messages/tr.json";
import { GET as getDefaultFeed } from "../../feed.xml/route";
import { generateStaticParams, GET } from "./route";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "news";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

function call(locale: string) {
  return GET(new Request(`https://reptiles.ge/${locale}/feed.xml`), {
    params: Promise.resolve({ locale }),
  });
}

describe("news feed routes", () => {
  it("serves the Georgian feed at the unprefixed URL", async () => {
    const response = await getDefaultFeed();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/atom+xml; charset=utf-8",
    );
    const body = await response.text();
    expect(body).toContain('xml:lang="ka"');
    expect(body).toContain(`<title>${ka.news.metaTitle}</title>`);
  });

  it("serves a localized feed for each prefixed locale", async () => {
    for (const locale of ["en", "ru", "tr"] as const) {
      const response = await call(locale);
      expect(response.status).toBe(200);
      const body = await response.text();
      expect(body).toContain(`xml:lang="${locale}"`);
      expect(body).toContain(
        `<title>${messages[locale].news.metaTitle.replace(/'/g, "&apos;")}</title>`,
      );
    }
  });

  it("redirects the prefixed Georgian feed to the canonical one", async () => {
    const response = await call("ka");
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(
      "https://reptiles.ge/feed.xml",
    );
  });

  it("returns 404 for an unknown locale", async () => {
    expect((await call("xx")).status).toBe(404);
  });

  it("prerenders only the prefixed locales", () => {
    expect(generateStaticParams()).toEqual([
      { locale: "en" },
      { locale: "ru" },
      { locale: "tr" },
    ]);
  });
});
