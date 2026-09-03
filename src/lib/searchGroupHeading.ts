import { type SearchKind } from "@/lib/siteSearch";

export type SearchGroupTitles = {
  featured: string;
  pages: string;
  recent: string;
  regions: string;
  species: string;
  suggested: string;
};

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
