import type { Metadata } from "next";

import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { generateMetadata as aboutMetadata } from "@/app/[locale]/about/page";
import { generateMetadata as authorMetadata } from "@/app/[locale]/authors/[slug]/page";
import { generateMetadata as authorsMetadata } from "@/app/[locale]/authors/page";
import { generateMetadata as contactMetadata } from "@/app/[locale]/contact/page";
import { generateMetadata as newsMetadata } from "@/app/[locale]/news/page";
import { generateMetadata as homeMetadata } from "@/app/[locale]/page";
import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { createGroupHubRoute } from "@/lib/createGroupHubRoute";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { siteConfig } from "@/lib/site";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import { contributorsFixture } from "../../tests/fixtures/speciesCatalog";

const messages = { en, ka, ru, tr };

vi.mock("@/i18n/navigation", async () => {
  const { compilePathname } =
    await import("../../tests/support/compilePathname");
  return {
    getPathname: ({
      href,
      locale,
    }: {
      href: string | { params?: Record<string, string>; pathname: string };
      locale: string;
    }) => compilePathname(href, locale),
  };
});

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: string;
  }) =>
    createTranslator({
      locale,
      messages: messages[locale],
      namespace: namespace as "site",
    }),
  setRequestLocale: () => undefined,
}));

type Locale = (typeof routing.locales)[number];

const hubIds = Object.keys(GROUP_HUBS) as GroupHubId[];
const BRAND_SUFFIX = ` — ${siteConfig.titleBrand}`;

const KA_HEAD_TERMS: Record<GroupHubId, string> = {
  amphibians: "ამფიბიები",
  birds: "ფრინველები",
  fish: "თევზები",
  insects: "მწერები",
  lizards: "ხვლიკი",
  mammals: "ძუძუმწოვრები",
  scorpions: "მორიელი",
  snakes: "გველები",
  spiders: "ობობები",
  turtles: "კუ ",
};

async function hubMetadata(hubId: GroupHubId, locale: Locale) {
  const metadata = await createGroupHubRoute(hubId).generateMetadata({
    params: Promise.resolve({ locale }),
  });
  return {
    description: String(metadata.description),
    rawTitle: metadata.title,
    title: renderedTitle(metadata.title),
  };
}

function renderedTitle(title: Metadata["title"]) {
  if (typeof title === "string") return `${title}${BRAND_SUFFIX}`;
  return (title as { absolute: string }).absolute;
}

describe("group hub metadata", () => {
  it.each(routing.locales)(
    "keeps the empty fish hub out of the index in %s",
    async (locale) => {
      const metadata = await createGroupHubRoute("fish").generateMetadata({
        params: Promise.resolve({ locale }),
      });
      expect(metadata.robots).toEqual({ follow: true, index: false });
    },
  );

  it("keeps a hub with species indexable", async () => {
    const metadata = await createGroupHubRoute("snakes").generateMetadata({
      params: Promise.resolve({ locale: "ka" }),
    });
    expect(metadata.robots).toMatchObject({ index: true });
  });

  it.each(routing.locales)(
    "fits %s titles and descriptions in the snippet limits",
    async (locale) => {
      const titles = new Set<string>();
      const descriptions = new Set<string>();
      for (const hubId of hubIds) {
        const { description, title } = await hubMetadata(hubId, locale);
        expect(title.length, `${hubId} ${locale}`).toBeLessThanOrEqual(60);
        expect(description.length, `${hubId} ${locale}`).toBeLessThanOrEqual(
          160,
        );
        titles.add(title);
        descriptions.add(description);
      }
      expect(titles.size).toBe(hubIds.length);
      expect(descriptions.size).toBe(hubIds.length);
    },
  );

  it.each(routing.locales)(
    "renders %s hub titles without the brand suffix",
    async (locale) => {
      for (const hubId of hubIds) {
        const { rawTitle, title } = await hubMetadata(hubId, locale);
        expect(rawTitle, `${hubId} ${locale}`).toEqual({ absolute: title });
        expect(title, `${hubId} ${locale}`).not.toContain(siteConfig.name);
      }
    },
  );

  it.each(
    hubIds.flatMap((hubId) =>
      routing.locales.map((locale) => [hubId, locale] as const),
    ),
  )(
    "states the %s catalog count in the %s description",
    async (hubId, locale) => {
      const count = (
        await getCatalogSpeciesByGroup(GROUP_HUBS[hubId].group, locale)
      ).length;
      const { description } = await hubMetadata(hubId, locale);
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description).toMatch(new RegExp(`(^|\\D)${count}(\\D|$)`));
    },
  );

  it.each(Object.entries(KA_HEAD_TERMS))(
    "leads the KA %s title and description with %s",
    async (hubId, term) => {
      const { description, title } = await hubMetadata(
        hubId as GroupHubId,
        "ka",
      );
      expect(title.startsWith(term)).toBe(true);
      expect(description.startsWith(term)).toBe(true);
    },
  );
});

describe("branded page titles", () => {
  const author = contributorsFixture()[0];
  const pages: Array<
    [string, (locale: Locale) => Metadata | Promise<Metadata>]
  > = [
    ["home", (locale) => homeMetadata({ params: Promise.resolve({ locale }) })],
    [
      "about",
      (locale) => aboutMetadata({ params: Promise.resolve({ locale }) }),
    ],
    [
      "contact",
      (locale) => contactMetadata({ params: Promise.resolve({ locale }) }),
    ],
    [
      "contributors",
      (locale) => authorsMetadata({ params: Promise.resolve({ locale }) }),
    ],
    [
      "contributor profile",
      (locale) =>
        authorMetadata({
          params: Promise.resolve({ locale, slug: author.id }),
        }),
    ],
    ["news", (locale) => newsMetadata({ params: Promise.resolve({ locale }) })],
  ];

  it.each(
    pages.flatMap(([name, load]) =>
      routing.locales.map((locale) => [name, locale, load] as const),
    ),
  )("keeps the brand in the %s title (%s)", async (_name, locale, load) => {
    const metadata = await load(locale);
    expect(renderedTitle(metadata.title)).toContain(siteConfig.name);
  });

  it.each(routing.locales)(
    "fits the %s contributors index title in 60 characters with the brand",
    async (locale) => {
      const metadata = await authorsMetadata({
        params: Promise.resolve({ locale }),
      });
      const title = renderedTitle(metadata.title);
      expect(title.endsWith(BRAND_SUFFIX)).toBe(true);
      expect(title.length).toBeLessThanOrEqual(60);
    },
  );
});
