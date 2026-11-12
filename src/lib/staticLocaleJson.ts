import { hasLocale } from "next-intl";

import { type AppLocale, routing } from "@/i18n/routing";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

export function staticLocaleJsonRoute(
  build: (locale: AppLocale) => Promise<unknown>,
) {
  return {
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    async GET(
      _request: Request,
      { params }: { params: Promise<{ locale: string }> },
    ) {
      const { locale } = await params;
      if (!hasLocale(routing.locales, locale)) {
        return new Response(null, { headers: noindex, status: 404 });
      }
      return Response.json(await build(locale), { headers: noindex });
    },
  };
}
