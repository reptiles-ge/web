import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";

import en from "../../../../messages/en.json";
import ka from "../../../../messages/ka.json";
import ru from "../../../../messages/ru.json";
import tr from "../../../../messages/tr.json";
import { generateMetadata } from "./page";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "news";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
  setRequestLocale: () => undefined,
}));

describe("news index metadata", () => {
  it.each(routing.locales)(
    "leaves the %s Atom feed link to the locale layout",
    async (locale) => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale }),
      });
      expect(metadata.alternates).not.toHaveProperty("types");
      expect(metadata.alternates?.canonical).toBeTruthy();
      expect(metadata.alternates?.languages).toHaveProperty("x-default");
      expect(metadata.title).toBe(messages[locale].news.metaTitle);
    },
  );

  it("returns nothing for an unknown locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "xx" }) }),
    ).toEqual({});
  });
});
