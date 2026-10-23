import { hasLocale } from "next-intl";

import { optimizedImageEntries } from "@/data/optimizedImages";
import { routing } from "@/i18n/routing";
import { getAtlasPage } from "@/lib/atlasList";
import { parseAtlasQueryParams } from "@/lib/atlasQuery";
import { CatalogQueryError } from "@/lib/speciesCatalogApi";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const searchParams = new URL(request.url).searchParams;
  const counts = searchParams.get("counts") === "1";
  searchParams.delete("counts");
  const query = parseAtlasQueryParams(searchParams);
  if (!query) {
    return new Response(null, { headers: noindex, status: 400 });
  }
  try {
    const page = await getAtlasPage(locale, query, counts ? 1 : undefined);
    const body = counts
      ? { facets: page.facets, total: page.total }
      : {
          ...page,
          entries: optimizedImageEntries(
            page.items.flatMap((item) => [item.image, item.mobileImage]),
          ),
        };
    return Response.json(body, {
      headers: {
        ...noindex,
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    });
  } catch (error) {
    if (error instanceof CatalogQueryError && error.status === 400) {
      return new Response(null, { headers: noindex, status: 400 });
    }
    throw error;
  }
}
