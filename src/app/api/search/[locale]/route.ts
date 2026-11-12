import { routing } from "@/i18n/routing";
import { getContributors } from "@/lib/authorsApi";
import { getNewsSummaries } from "@/lib/newsApi";
import {
  buildSearchIndex,
  type SearchCatalogs,
  type SearchContributors,
} from "@/lib/searchIndexBuild";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { staticLocaleJsonRoute } from "@/lib/staticLocaleJson";

export const dynamic = "force-static";

const route = staticLocaleJsonRoute(async (locale) => {
  const [lists, authorLists, news] = await Promise.all([
    Promise.all(routing.locales.map((item) => getSpeciesCatalog(item))),
    Promise.all(routing.locales.map((item) => getContributors(item))),
    getNewsSummaries(),
  ]);
  const catalogs = {} as SearchCatalogs;
  const contributors = {} as SearchContributors;
  for (const [index, item] of routing.locales.entries()) {
    catalogs[item] = lists[index] ?? [];
    contributors[item] = authorLists[index] ?? [];
  }
  return buildSearchIndex(locale, catalogs, contributors, news);
});

export const generateStaticParams = route.generateStaticParams;
export const GET = route.GET;
