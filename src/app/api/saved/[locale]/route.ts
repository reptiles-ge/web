import { buildSavedSpeciesCards } from "@/lib/savedSpeciesCards";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { staticLocaleJsonRoute } from "@/lib/staticLocaleJson";

export const dynamic = "force-static";

const route = staticLocaleJsonRoute(async (locale) =>
  buildSavedSpeciesCards(await getSpeciesCatalog(locale), locale),
);

export const generateStaticParams = route.generateStaticParams;
export const GET = route.GET;
