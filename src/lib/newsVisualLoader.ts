import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

import { getContributorDirectory } from "@/lib/authorsApi";
import { NO_CONTRIBUTORS } from "@/lib/contributorCredits";
import { getNewsVisual, newsAtlasSpecies } from "@/lib/newsVisual";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

export async function loadNewsVisuals(
  articles: readonly (NewsArticle | null | undefined)[],
  locale: AppLocale,
) {
  const unillustrated = articles.filter((article): article is NewsArticle =>
    Boolean(article && !article.image),
  );
  const catalog =
    unillustrated.length > 0 ? await getSpeciesCatalog(locale) : [];
  const credited = unillustrated.some((article) =>
    newsAtlasSpecies(article, catalog)?.imageCredit?.photographer?.trim(),
  );
  const contributors = credited
    ? await getContributorDirectory(locale)
    : NO_CONTRIBUTORS;
  return articles.map((article) =>
    article ? getNewsVisual(article, locale, catalog, contributors) : null,
  );
}
