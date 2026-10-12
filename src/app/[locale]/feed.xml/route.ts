import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { newsFeedUrl } from "@/lib/newsFeed";
import { newsFeedResponse } from "@/lib/newsFeedResponse";

type Context = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: Context) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 });
  }
  if (locale === routing.defaultLocale) {
    return Response.redirect(newsFeedUrl(locale), 301);
  }
  return newsFeedResponse(locale);
}
