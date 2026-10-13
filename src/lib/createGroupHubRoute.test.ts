import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { createGroupHubRoute } from "@/lib/createGroupHubRoute";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { siteConfig } from "@/lib/site";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const messages = { en, ka, ru, tr };

vi.mock("@/i18n/navigation", async () => {
  const { pathnames } = await import("@/i18n/pathnames");
  return {
    getPathname: ({ href, locale }: { href: string; locale: string }) => {
      const entry = pathnames[href as keyof typeof pathnames];
      const path =
        typeof entry === "string" ? entry : entry[locale as keyof typeof entry];
      return locale === "ka" ? path : `/${locale}${path}`;
    },
  };
});

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: GroupHubId;
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
  setRequestLocale: () => undefined,
}));

const hubIds = Object.keys(GROUP_HUBS) as GroupHubId[];

const KA_HEAD_TERMS: Partial<Record<GroupHubId, string>> = {
  amphibians: "ამფიბიები",
  birds: "ფრინველები",
  insects: "მწერები",
  lizards: "ხვლიკი",
  mammals: "ძუძუმწოვრები",
  scorpions: "მორიელი",
  spiders: "ობობები",
  turtles: "კუ ",
};

async function hubMetadata(
  hubId: GroupHubId,
  locale: (typeof routing.locales)[number],
) {
  const metadata = await createGroupHubRoute(hubId).generateMetadata({
    params: Promise.resolve({ locale }),
  });
  const title =
    typeof metadata.title === "string"
      ? `${metadata.title} — ${siteConfig.name}`
      : (metadata.title as { absolute: string }).absolute;
  return { description: String(metadata.description), title };
}

describe("group hub metadata", () => {
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

  it.each(
    Object.keys(KA_HEAD_TERMS).flatMap((hubId) =>
      routing.locales.map((locale) => [hubId as GroupHubId, locale] as const),
    ),
  )(
    "states the %s catalog count in the %s description",
    async (hubId, locale) => {
      const count = getCatalogSpeciesByGroup(GROUP_HUBS[hubId].group).length;
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
