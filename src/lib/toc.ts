import { slugify } from "@/lib/slugify";

export type TocItem = {
  id: string;
  label: string;
  level?: 2 | 3;
};

export const SPECIES_SECTION_IDS = {
  atAGlance: "at-a-glance",
  overview: "overview",
  gallery: "gallery",
  range: "range",
  identification: "identification",
  biology: "biology",
  faq: "faq",
  sources: "sources",
  related: "related",
} as const;

export const REGION_SECTION_IDS = {
  range: "range",
  habitats: "habitats",
  species: "species",
  venomous: "venomous",
  faq: "faq",
  related: "related",
} as const;

export function buildTocItems(
  entries: Array<TocItem | false | null | undefined>,
): TocItem[] {
  const seen = new Set<string>();
  const items: TocItem[] = [];

  for (const entry of entries) {
    if (!entry) continue;
    const id = entry.id || slugify(entry.label);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    items.push({
      id,
      label: entry.label,
      level: entry.level ?? 2,
    });
  }

  return items;
}
