import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { buildSearchIndex, type SearchCatalogs } from "@/lib/searchIndexBuild";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const lists = await Promise.all(
    routing.locales.map((item) => getSpeciesCatalog(item)),
  );
  const catalogs = {} as SearchCatalogs;
  for (const [index, item] of routing.locales.entries()) {
    catalogs[item] = lists[index] ?? [];
  }
  return Response.json(buildSearchIndex(locale, catalogs), {
    headers: noindex,
  });
}
