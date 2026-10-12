import type { RegionPathId } from "@/data/georgia-paths";
import type { AppLocale } from "@/i18n/routing";

import { georgiaRegionLabelPoints } from "@/data/georgia-paths";
import { getRegionContent } from "@/data/regionContent";
import { getRegionSpecies, localizeRegionText, regions } from "@/data/regions";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type SpeciesHref, speciesHref } from "@/lib/speciesRoutes";

export type RegionMixKey =
  "amphibians" | "birds" | "lizards" | "other" | "snakes";

export type RegionsIndexItem = {
  biome: string;
  description: string;
  habitats: string[];
  id: RegionPathId;
  label: [number, number];
  mix: Record<RegionMixKey, number>;
  n: string;
  name: string;
  nameIn: string;
  path: string;
  relatedIds: RegionPathId[];
  thumbViewBox: string;
  total: number;
  venomous: Array<{ href: SpeciesHref; id: string; name: string }>;
};

const LABEL_OVERRIDES: Partial<Record<RegionPathId, [number, number]>> = {
  kakheti: [824, 337.6],
};

const THUMB_PADDING = 0.08;

export function getRegionsIndexItems(locale: AppLocale): RegionsIndexItem[] {
  return regions.map((region, index) => {
    const content = getRegionContent(region.id);
    const species = getRegionSpecies(region);
    const mix: Record<RegionMixKey, number> = {
      amphibians: 0,
      birds: 0,
      lizards: 0,
      other: 0,
      snakes: 0,
    };
    for (const item of species) {
      mix[regionMixKey(item.id)] += 1;
    }

    return {
      biome: localizeRegionText(content.biome, locale),
      description: localizeRegionText(region.description, locale),
      habitats: content.habitats.map((habitat) =>
        localizeRegionText(habitat, locale),
      ),
      id: region.id,
      label: LABEL_OVERRIDES[region.id] ?? georgiaRegionLabelPoints[region.id],
      mix,
      n: String(index + 1).padStart(2, "0"),
      name: localizeRegionText(region.name, locale),
      nameIn: localizeRegionText(region.nameIn, locale),
      path: region.path,
      relatedIds: content.relatedIds,
      thumbViewBox: pathViewBox(region.path),
      total: species.length,
      venomous: species
        .filter((item) => item.danger === "High" || item.danger === "Moderate")
        .map((item) => ({
          href: speciesHref(item.id, locale),
          id: item.id,
          name: localizeSpecies(item, locale).commonName,
        })),
    };
  });
}

function pathViewBox(path: string) {
  const tokens = path.match(/[MmLlZz]|-?\d*\.?\d+/g) ?? [];
  let x = 0;
  let y = 0;
  let command = "M";
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (/[MmLlZz]/.test(token)) {
      command = token;
      continue;
    }
    const dx = Number(token);
    const dy = Number(tokens[index + 1]);
    index += 1;
    if (command === "M" || command === "L") {
      x = dx;
      y = dy;
      command = "L";
    } else {
      x += dx;
      y += dy;
      command = "l";
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const width = maxX - minX;
  const height = maxY - minY;
  const pad = Math.max(width, height) * THUMB_PADDING;
  return [minX - pad, minY - pad, width + pad * 2, height + pad * 2]
    .map((value) => value.toFixed(1))
    .join(" ");
}

function regionMixKey(speciesId: string): RegionMixKey {
  switch (getSpeciesAtlasMeta(speciesId).group) {
    case "amphibian":
      return "amphibians";
    case "bird":
      return "birds";
    case "lizard":
    case "turtle":
      return "lizards";
    case "snake":
      return "snakes";
    default:
      return "other";
  }
}
