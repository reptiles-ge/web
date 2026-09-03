import type { SearchGroupTitles } from "@/components/SpeciesSearchResults";
import { type SearchKind } from "@/lib/siteSearch";

export function searchGroupHeading(
  kind: SearchKind,
  isRecent: boolean,
  query: string,
  titles: SearchGroupTitles,
) {
  if (isRecent) return titles.recent;
  if (!query && kind === "page") return titles.suggested;
  if (!query && kind === "species") return titles.featured;
  return kind === "page"
    ? titles.pages
    : kind === "species"
      ? titles.species
      : titles.regions;
}
