import { type AppLocale, routing } from "@/i18n/routing";
import { ANIMAL_GROUP_TO_HUB, type GroupHubId } from "@/lib/groupHubs";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

export async function speciesStaticParams(hubId: GroupHubId) {
  const catalogs = await Promise.all(
    routing.locales.map((locale) => getSpeciesCatalog(locale)),
  );
  return routing.locales.flatMap((locale: AppLocale, index) =>
    (catalogs[index] ?? [])
      .filter((item) => ANIMAL_GROUP_TO_HUB[item.group] === hubId)
      .map((item) => ({ locale, slug: item.slug })),
  );
}
