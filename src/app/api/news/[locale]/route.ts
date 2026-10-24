import { hasLocale } from "next-intl";

import { optimizedImageEntries } from "@/data/optimizedImages";
import { routing } from "@/i18n/routing";
import { newsBrowserEntries } from "@/lib/newsBrowserItems";
import {
  type NewsBrowserResult,
  parseNewsBrowserParams,
} from "@/lib/newsBrowserQuery";
import { getNewsListPage } from "@/lib/newsPages";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const query = parseNewsBrowserParams(new URL(request.url).searchParams);
  if (!query) {
    return new Response(null, { headers: noindex, status: 400 });
  }
  const newsPage = await getNewsListPage(locale, query.page, query);
  if (!newsPage) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const { items, monthLabels } = await newsBrowserEntries(
    newsPage.articles,
    locale,
  );
  return Response.json(
    {
      entries: optimizedImageEntries(items.map((item) => item.entry.src)),
      facets: newsPage.facets,
      items,
      monthLabels,
      page: newsPage.page,
      pageCount: newsPage.pageCount,
      total: newsPage.total,
    } satisfies NewsBrowserResult,
    {
      headers: {
        ...noindex,
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    },
  );
}
