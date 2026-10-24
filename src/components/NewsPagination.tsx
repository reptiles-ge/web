import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { NewsPaginationView } from "@/components/NewsPaginationView";
import { Link } from "@/i18n/navigation";
import { newsPageHref } from "@/lib/newsPages";

export async function NewsPagination({
  current,
  locale,
  pageCount,
}: {
  current: number;
  locale: AppLocale;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const t = await getTranslations({ locale, namespace: "news" });

  return (
    <NewsPaginationView
      current={current}
      labels={{
        newer: t("newerArticles"),
        older: t("olderArticles"),
        page: (page) => t("pageNumber", { page }),
        pagination: t("paginationLabel"),
      }}
      pageControl={({ page, ...props }) => (
        <Link {...props} href={newsPageHref(page)} />
      )}
      pageCount={pageCount}
    />
  );
}
