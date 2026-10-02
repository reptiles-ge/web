import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { LocalizedLink } from "@/components/LocalizedLink";
import { NotFoundBoundary } from "@/components/NotFoundBoundary";

export async function NotFoundShell({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div data-hide-footer data-not-found-shell>
      <div
        className="flex min-h-svh flex-col items-center justify-center gap-5 bg-ink px-6 text-center text-ink-foreground"
        data-not-found-fallback
      >
        <p className="font-display text-6xl font-semibold">404</p>
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <LocalizedLink
          className="rounded-full bg-white px-6 py-3 text-ink"
          href="/"
          locale={locale}
        >
          {t("home")}
        </LocalizedLink>
      </div>
      <NotFoundBoundary />
    </div>
  );
}
