import { hasLocale } from "next-intl";

import { optimizedImageEntries } from "@/data/optimizedImages";
import { routing } from "@/i18n/routing";
import { getAtlasPhotoPage } from "@/lib/atlasList";
import { CatalogPageError } from "@/lib/speciesCatalogApi";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

const CURSOR = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { headers: noindex, status: 404 });
  }
  const cursor = new URL(request.url).searchParams.get("cursor") ?? undefined;
  if (cursor !== undefined && !CURSOR.test(cursor)) {
    return new Response(null, { headers: noindex, status: 400 });
  }
  try {
    const page = await getAtlasPhotoPage(locale, cursor);
    const entries = optimizedImageEntries(
      Object.values(page.photos).flatMap((photo) => [
        photo.image,
        photo.mobileImage,
      ]),
    );
    return Response.json(
      { ...page, entries },
      {
        headers: {
          ...noindex,
          "Cache-Control": "public, max-age=300, s-maxage=3600",
        },
      },
    );
  } catch (error) {
    if (error instanceof CatalogPageError && error.status === 400) {
      return new Response(null, { headers: noindex, status: 400 });
    }
    throw error;
  }
}
