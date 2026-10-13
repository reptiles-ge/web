import { taxonIdentifiers } from "@/data/taxonIdentifiers";

export function taxonIdentifierUrls(speciesId: string): string[] {
  const ids = taxonIdentifiers[speciesId];
  if (!ids) return [];
  return [
    ...(ids.wikidata ? [`https://www.wikidata.org/wiki/${ids.wikidata}`] : []),
    ...(ids.gbif === undefined
      ? []
      : [`https://www.gbif.org/species/${ids.gbif}`]),
    ...(ids.inaturalist === undefined
      ? []
      : [`https://www.inaturalist.org/taxa/${ids.inaturalist}`]),
  ];
}
