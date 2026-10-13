import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing } from "@/i18n/routing";
import {
  SPECIES_META_TITLE_OVERRIDE,
  speciesPageMetaTitle,
  speciesTitleIntentKey,
  TARGET_META_TITLE_LENGTH,
} from "@/lib/speciesMeta";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const messages = { en, ka, ru, tr };
const catalogIds = new Set(getCatalogSpecies().map((species) => species.id));

function renderedTitles(locale: (typeof routing.locales)[number]) {
  const t = createTranslator({
    locale,
    messages: messages[locale],
    namespace: "speciesMeta",
  });
  return getCatalogSpecies().map((raw) => {
    const item = localizeSpecies(raw, locale);
    const group = getSpeciesAtlasMeta(raw.id).group;
    return {
      bareName: `${item.commonName} (${item.scientificName})`,
      id: raw.id,
      title: speciesPageMetaTitle(
        raw.id,
        locale,
        item.commonName,
        item.scientificName,
        t(speciesTitleIntentKey(group, raw.danger)),
        t("titleShort"),
      ),
    };
  });
}

describe("species page titles", () => {
  it.each(routing.locales)(
    "fit %s titles in 60 characters unless the bare name alone is longer",
    (locale) => {
      for (const { bareName, id, title } of renderedTitles(locale)) {
        if (title.length <= TARGET_META_TITLE_LENGTH) continue;
        expect(title, `${id} ${locale}`).toBe(bareName);
        expect(bareName.length, `${id} ${locale}`).toBeGreaterThan(
          TARGET_META_TITLE_LENGTH,
        );
      }
    },
  );

  it.each(routing.locales)("are unique within %s", (locale) => {
    const titles = renderedTitles(locale).map(({ title }) => title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe("SPECIES_META_TITLE_OVERRIDE", () => {
  const overrides = Object.entries(SPECIES_META_TITLE_OVERRIDE).flatMap(
    ([id, locales]) =>
      Object.entries(locales ?? {}).map(([locale, title]) => ({
        id,
        locale,
        title,
      })),
  );

  it("targets catalog species only", () => {
    for (const { id } of overrides) {
      expect(catalogIds.has(id), id).toBe(true);
    }
  });

  it("keeps every hand-written title within 60 characters", () => {
    for (const { id, locale, title } of overrides) {
      expect(title, `${id} ${locale}`).toBe(title.trim());
      expect(title.length, `${id} ${locale}`).toBeLessThanOrEqual(
        TARGET_META_TITLE_LENGTH,
      );
    }
  });
});
