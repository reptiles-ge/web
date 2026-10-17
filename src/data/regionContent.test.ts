import { describe, expect, it } from "vitest";

import { regions } from "@/data/mapRegions";
import {
  getLocalizedRegionContent,
  getRegionContent,
  getRegionDirectory,
  localizeRegionFaq,
  regionRelatedLinks,
} from "@/data/regionContent";
import { getRegionLabels } from "@/data/regions";

describe("getLocalizedRegionContent", () => {
  it("resolves one region in one locale to plain strings", () => {
    const content = getLocalizedRegionContent("kakheti", "ru");
    const source = getRegionContent("kakheti");

    expect(content.biome).toBe(source.biome.ru);
    expect(content.overview).toBe(source.overview.ru);
    expect(content.habitats).toEqual(source.habitats.map((item) => item.ru));
    expect(content.faq).toEqual(
      source.faq.map((item) => ({
        answer: item.answer.ru,
        question: item.question.ru,
      })),
    );
  });

  it("links related regions with their localized name and count", () => {
    const content = getLocalizedRegionContent("kakheti", "en");
    const source = getRegionContent("kakheti");

    expect(content.related.map((item) => item.id)).toEqual(source.relatedIds);
    for (const item of content.related) {
      const region = regions.find((entry) => entry.id === item.id)!;
      expect(item.name).toBe(region.name.en);
      expect(item.biome).toBe(getRegionContent(item.id).biome.en);
      expect(item.speciesCount).toBe(region.speciesIds.length);
    }
  });
});

describe("region content guards", () => {
  it("drops an FAQ entry that has no text in the locale", () => {
    expect(
      localizeRegionFaq(
        [
          { answer: { en: "Yes." }, question: { en: "Kept?" } },
          { answer: { en: " " }, question: { en: "Blank answer?" } },
          { answer: { ka: "კი." }, question: { ka: "მხოლოდ ქართულად?" } },
        ],
        "en",
      ),
    ).toEqual([{ answer: "Yes.", question: "Kept?" }]);
  });

  it("skips a related id that is not a region", () => {
    expect(
      regionRelatedLinks(["tbilisi", "atlantis"], "en").map((item) => item.id),
    ).toEqual(["tbilisi"]);
  });
});

describe("getRegionDirectory", () => {
  it("lists every region in the requested locale", () => {
    const directory = getRegionDirectory("tr");

    expect(directory.map((item) => item.id)).toEqual(
      regions.map((region) => region.id),
    );
    for (const item of directory) {
      expect(item.overview).toBe(getRegionContent(item.id).overview.tr);
    }
  });
});

describe("getRegionLabels", () => {
  it("gives the atlas filters one label per region", () => {
    expect(getRegionLabels("ka")).toEqual(
      regions.map((region) => ({ id: region.id, label: region.name.ka })),
    );
  });
});
