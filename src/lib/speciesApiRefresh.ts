import { routing } from "@/i18n/routing";
import { createApiClient } from "@/lib/apiClient";
import { serverEnv } from "@/lib/env";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

const CATALOG_VIEWS = ["card", "full", "photos", "quiz"] as const;

const NEWS_TAG_PREFIX = "news:";

const SPECIES_TAG_PREFIX = "species:";

export async function refreshSpeciesApiCache(tags: string[]) {
  const token = serverEnv().REVALIDATE_TOKEN;
  if (!token) return;
  const api = createApiClient();
  const options = {
    headers: { "X-Cache-Bypass": token },
    init: { cache: "no-store" as const },
  };
  const catalog = tags.includes("species")
    ? routing.locales.flatMap((locale) =>
        CATALOG_VIEWS.map(
          (view) => () =>
            api.v1.catalog.$get(
              { header: { "x-locale": locale }, query: { view } },
              options,
            ),
        ),
      )
    : [];
  const profiles = tags
    .filter((tag) => tag.startsWith(SPECIES_TAG_PREFIX))
    .map((tag) => tag.slice(SPECIES_TAG_PREFIX.length))
    .flatMap((id) => [
      ...routing.locales.map(
        (locale) => () =>
          api.v1.species[":slug"].$get(
            {
              header: { "x-locale": locale },
              param: { slug: getSpeciesPublicSlug(id, locale) },
            },
            options,
          ),
      ),
      () =>
        api.v1.species[":slug"]["field-records"].$get(
          { header: { "x-locale": "en" }, param: { slug: id } },
          options,
        ),
    ]);
  const newsList = tags.includes("news")
    ? routing.locales.map(
        (locale) => () =>
          api.v1.news.$get(
            { header: { "x-locale": locale }, query: {} },
            options,
          ),
      )
    : [];
  const newsArticles = tags
    .filter((tag) => tag.startsWith(NEWS_TAG_PREFIX))
    .map((tag) => tag.slice(NEWS_TAG_PREFIX.length))
    .flatMap((slug) =>
      routing.locales.map(
        (locale) => () =>
          api.v1.news[":slug"].$get(
            { header: { "x-locale": locale }, param: { slug } },
            options,
          ),
      ),
    );
  await [...catalog, ...profiles, ...newsList, ...newsArticles].reduce<
    Promise<void>
  >(
    (previous, request) =>
      previous.then(() =>
        request().then(
          () => undefined,
          (error: unknown) => {
            console.error("Species API cache refresh failed", error);
          },
        ),
      ),
    Promise.resolve(),
  );
}
