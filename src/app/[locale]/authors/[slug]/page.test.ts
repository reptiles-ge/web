import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { creditAuthorUrl } from "@/lib/creditAuthors";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";

import en from "../../../../../messages/en.json";
import ka from "../../../../../messages/ka.json";
import ru from "../../../../../messages/ru.json";
import tr from "../../../../../messages/tr.json";
import { contributorsFixture } from "../../../../../tests/fixtures/speciesCatalog";
import { dynamicParams, generateMetadata } from "./page";

const messages = { en, ka, ru, tr };

vi.mock("@/i18n/navigation", () => ({
  getPathname: ({
    href,
    locale,
  }: {
    href: string | { params?: { slug?: string }; pathname: string };
    locale: string;
  }) => {
    const base =
      locale === "ka" ? "/kontributorebi" : `/${locale}/contributors`;
    if (typeof href === "string") return href === "/authors" ? base : "/";
    return `${base}/${href.params?.slug}`;
  },
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "author";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

const cases = routing.locales.flatMap((locale) =>
  contributorsFixture(locale).map((author) => ({ author, locale })),
);

function metadataFor(slug: string, locale: string) {
  return generateMetadata({ params: Promise.resolve({ locale, slug }) });
}

function sentencesOf(text: string) {
  return text.split(/(?<=[.!?])\s+/);
}

describe("contributor profile metadata", () => {
  it.each(cases)(
    "$author.id in $locale ends its description on a whole sentence",
    async ({ author, locale }) => {
      const metadata = await metadataFor(author.id, locale);
      const description = metadata.description as string;
      expect(description).not.toMatch(/…$/);
      expect(description).toMatch(/[.!?]$/);
      expect(description.length).toBeLessThanOrEqual(160);

      const override = kaMetaDescriptionOverride(
        locale,
        new URL(creditAuthorUrl(locale, author.id)).pathname,
        "",
      );
      const manual = locale === "ka" ? undefined : author.metaDescription;
      if (override || manual) {
        expect(description).toBe(override || manual);
        return;
      }
      const bio = author.bio;
      if (!bio) return;
      expect(bio.startsWith(description)).toBe(true);
      const bioSentences = sentencesOf(bio);
      for (const sentence of sentencesOf(description)) {
        expect(bioSentences).toContain(sentence);
      }
    },
  );

  it.each(cases)(
    "$author.id in $locale names the role in the title only for people",
    async ({ author, locale }) => {
      const metadata = await metadataFor(author.id, locale);
      const name = author.name;
      const title = metadata.title as { absolute: string };
      if (author.kind === "person") {
        const role = messages[locale].author.roles[author.role];
        expect(title.absolute).toBe(
          `${name}, ${role.toLocaleLowerCase(locale)} — Reptiles.ge`,
        );
        expect(metadata.openGraph).toMatchObject({ type: "profile" });
      } else {
        expect(title.absolute).toBe(`${name} — Reptiles.ge`);
        expect(metadata.openGraph).toMatchObject({ type: "website" });
      }
      expect(metadata.robots).toMatchObject({ follow: true, index: true });
    },
  );

  it("renders a contributor added after the deploy and treats other slugs as not found", async () => {
    expect(dynamicParams).toBe(true);
    for (const slug of ["no-such-contributor", "charles-j-sharp", "Bad_Slug"]) {
      const metadata = await metadataFor(slug, "en");
      expect(metadata.robots, slug).toBeNull();
      expect(metadata.title, slug).toBe(en.author.notFound);
    }
  });

  it("keeps canonical and hreflang alternates for every locale", async () => {
    const metadata = await metadataFor("zauri-khachidze", "en");
    expect(metadata.alternates?.canonical).toMatch(
      /\/en\/contributors\/zauri-khachidze$/,
    );
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual(
      ["en", "ka", "ru", "tr", "x-default"].sort(),
    );
  });
});
