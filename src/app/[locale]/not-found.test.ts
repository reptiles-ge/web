import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";

import en from "../../../messages/en.json";
import ka from "../../../messages/ka.json";
import ru from "../../../messages/ru.json";
import tr from "../../../messages/tr.json";
import { generateMetadata } from "./not-found";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "notFound";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

vi.mock("@/components/NotFoundShell", () => ({ NotFoundShell: () => null }));

describe("locale not-found metadata", () => {
  it.each(routing.locales)("titles the 404 in %s", async (locale) => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale }),
    });
    expect(metadata.title).toEqual({
      absolute: messages[locale].notFound.metaTitle,
    });
    expect(metadata.description).toBe(
      messages[locale].notFound.metaDescription,
    );
    expect(metadata.robots).toBeNull();
  });

  it("falls back to Georgian without a usable locale param", async () => {
    expect((await generateMetadata({})).title).toEqual({
      absolute: ka.notFound.metaTitle,
    });
    expect(
      (await generateMetadata({ params: Promise.resolve({ locale: "de" }) }))
        .title,
    ).toEqual({ absolute: ka.notFound.metaTitle });
  });
});
