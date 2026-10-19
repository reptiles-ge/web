import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import type { LocalizedText } from "@/data/mapRegions";
import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { getRegionContent } from "@/data/regionContent";
import {
  getRegionsForSpecies,
  localizeRegionTextIfPresent,
  regions,
  toRegionSpeciesCard,
} from "@/data/regions";
import {
  getCatalogSpecies,
  getSpeciesById,
  unpublishedSpeciesIds,
} from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlasMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { isSnakeSpecies } from "@/lib/clusterGuides";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";

const fieldRecordsById = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src/data/fieldRecords.generated.json"),
    "utf8",
  ),
) as Record<string, SpeciesFieldRecord[]>;

describe("region species cards", () => {
  it("keeps only the fields the region cards render", () => {
    const region = regions.find((item) => item.id === "kakheti");
    expect(region).toBeDefined();
    const cards = region!.speciesIds
      .map((id) => getSpeciesById(id))
      .filter((item) => item !== undefined)
      .map((item) => toRegionSpeciesCard(item, "ka"));

    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card).not.toHaveProperty("description");
      expect(card).not.toHaveProperty("faq");
      expect(card).not.toHaveProperty("fieldRecords");
      expect(card).not.toHaveProperty("gallery");
      expect(card).not.toHaveProperty("habitat");
      expect(card).not.toHaveProperty("overview");
      expect(card).not.toHaveProperty("searchText");
      expect(card).not.toHaveProperty("sources");
    }
  });
});

describe("region speciesIds", () => {
  it("only lists published catalog ids", () => {
    const published = new Set(getCatalogSpecies().map((item) => item.id));
    for (const region of regions) {
      for (const id of region.speciesIds) {
        expect(unpublishedSpeciesIds.has(id), `${region.id}:${id}`).toBe(false);
        expect(published.has(id), `${region.id}:${id}`).toBe(true);
      }
    }
  });

  it.each([
    "accipiter-nisus",
    "anguis-colchica",
    "dendrocopos-major",
    "erithacus-rubecula",
    "jynx-torquilla",
    "latrodectus-tredecimguttatus",
    "turdus-merula",
    "tyto-alba",
    "ciconia-ciconia",
    "coturnix-coturnix",
    "gypaetus-barbatus",
    "gyps-fulvus",
    "neophron-percnopterus",
    "columba-livia",
    "columba-palumbus",
    "streptopelia-turtur",
    "garrulus-glandarius",
    "darevskia-armeniaca",
    "darevskia-caucasica",
    "darevskia-dahli",
    "darevskia-derjugini",
    "darevskia-obscura",
    "darevskia-portschinskii",
    "eirenis-modestus",
    "elaphe-urartica",
    "eremias-velox",
    "hyla-orientalis",
    "mauremys-caspica",
    "paralaudakia-caucasia",
    "mustela-nivalis",
    "procyon-lotor",
    "vipera-renardi",
    "zamenis-longissimus",
    "xerotyphlops-vermicularis",
  ])("lists %s only where the record table confirms distribution", (id) => {
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: fieldRecordsById[species.id] ?? [],
      gallery: species.gallery,
      locale: "ka",
      speciesName: species.commonName,
    });
    const summary = getHalyomorphaOccurrenceSummary(
      records,
      "ka",
      confirmedRecordThresholdForSpecies(id),
    );
    expect(
      getRegionsForSpecies(id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    );
  });

  it("lists Brown Bear only where the record table confirms distribution", () => {
    const id = "ursus-arctos";
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: fieldRecordsById[species.id] ?? [],
      gallery: species.gallery,
      locale: "ka",
      speciesName: species.commonName,
    });
    const summary = getHalyomorphaOccurrenceSummary(
      records,
      "ka",
      confirmedRecordThresholdForSpecies(id),
    );
    expect(
      getRegionsForSpecies(id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    );
  });

  it("lists Caucasian Salamander only where the record table confirms distribution", () => {
    const id = "mertensiella-caucasica";
    const species = getSpeciesById(id);
    expect(species).toBeDefined();
    if (!species) return;
    const records = getHalyomorphaFieldRecords({
      fieldRecords: fieldRecordsById[species.id] ?? [],
      gallery: species.gallery,
      locale: "ka",
      speciesName: species.commonName,
    });
    const summary = getHalyomorphaOccurrenceSummary(
      records,
      "ka",
      confirmedRecordThresholdForSpecies(id),
    );
    expect(
      getRegionsForSpecies(id)
        .map((region) => region.id)
        .sort(),
    ).toEqual(
      summary.recordsByRegion
        .filter((region) => region.status === "confirmed")
        .map((region) => region.id)
        .sort(),
    );
  });
});

describe("region FAQ locale gating", () => {
  it("localizes Guria FAQ copy in every active locale", () => {
    const content = getRegionContent("guria");
    for (const entry of content.faq) {
      for (const locale of ["ka", "en", "ru", "tr"] as const) {
        expect(
          localizeRegionTextIfPresent(entry.question, locale),
        ).toBeTruthy();
        expect(localizeRegionTextIfPresent(entry.answer, locale)).toBeTruthy();
      }
    }
  });
});

describe("region copy locale parity", () => {
  it.each(regions.map((region) => [region.id] as const))(
    "%s has biome, overview, habitats and FAQ in every locale",
    (id) => {
      const content = getRegionContent(id);
      const texts: [string, LocalizedText][] = [
        ["biome", content.biome],
        ["overview", content.overview],
        ...content.habitats.map((text, index): [string, LocalizedText] => [
          `habitat ${index}`,
          text,
        ]),
        ...content.faq.flatMap((entry, index): [string, LocalizedText][] => [
          [`faq ${index} question`, entry.question],
          [`faq ${index} answer`, entry.answer],
        ]),
      ];
      for (const [label, text] of texts) {
        for (const locale of ["ka", "en", "ru", "tr"] as const) {
          expect(text[locale]?.trim(), `${label} ${locale}`).toBeTruthy();
        }
      }
    },
  );
});

describe("region FAQ venomous snakes", () => {
  const venomousSnakes = getCatalogSpecies().filter(
    (item) =>
      getSpeciesAtlasMeta(item.id).group === "snake" &&
      isVenomousDanger(item.danger),
  );

  it.each(regions.map((region) => [region.id, region] as const))(
    "%s FAQ names exactly the venomous snakes the region lists",
    (_, region) => {
      const content = getRegionContent(region.id);
      for (const locale of ["ka", "en", "ru", "tr"] as const) {
        const text = content.faq
          .map((entry) => localizeRegionTextIfPresent(entry.answer, locale))
          .filter(Boolean)
          .join("\n");
        if (!text) continue;
        for (const item of venomousSnakes) {
          const assertion = expect(text, `${locale} ${item.id}`);
          if (region.speciesIds.includes(item.id)) {
            assertion.toContain(item.scientificName);
          } else {
            assertion.not.toContain(item.scientificName);
          }
        }
      }
    },
  );
});

describe("region FAQ snake lists", () => {
  const LOCALES = ["ka", "en", "ru", "tr"] as const;
  const GLASS_LIZARD = {
    en: "glass lizard",
    ka: "გველხოკერა",
    ru: "желтопузик",
    tr: "cam kertenkele",
  } as const;
  const snakes = getCatalogSpecies().filter(isSnakeSpecies);
  const normalize = (text: string, locale: (typeof LOCALES)[number]) =>
    text.replaceAll("’", "'").toLocaleLowerCase(locale);
  const name = (id: string, locale: (typeof LOCALES)[number]) =>
    normalize(localizeSpecies(getSpeciesById(id)!, locale).commonName, locale);

  it.each(regions.map((region) => [region.id, region] as const))(
    "%s FAQ and overview name only the snakes the region lists",
    (_, region) => {
      const content = getRegionContent(region.id);
      const listed = new Set(region.speciesIds);
      for (const locale of LOCALES) {
        const text = [
          ...content.faq.map((entry) => entry.answer),
          content.overview,
          content.metaDescription ?? {},
        ]
          .map((entry) => localizeRegionTextIfPresent(entry, locale))
          .filter(Boolean)
          .join("\n");
        const lower = normalize(text, locale);
        for (const item of snakes) {
          if (listed.has(item.id)) continue;
          expect(text, `${locale} ${item.id}`).not.toContain(
            item.scientificName,
          );
          expect(lower, `${locale} ${item.id}`).not.toContain(
            name(item.id, locale),
          );
        }
        if (!listed.has("pseudopus-apodus")) {
          expect(lower, `${locale} glass lizard`).not.toContain(
            GLASS_LIZARD[locale],
          );
        }
      }
    },
  );

  it.each(regions.map((region) => [region.id, region] as const))(
    "%s 'which snakes' answer names every snake the region lists",
    (_, region) => {
      const entry = getRegionContent(region.id).faq.find((item) =>
        item.question.en.startsWith("Which snakes"),
      );
      if (!entry) return;
      const listedSnakes = region.speciesIds.filter((id) =>
        snakes.some((item) => item.id === id),
      );
      for (const locale of LOCALES) {
        const answer = normalize(entry.answer[locale], locale);
        for (const id of listedSnakes) {
          expect(answer, `${locale} ${id}`).toContain(name(id, locale));
        }
      }
    },
  );
});
