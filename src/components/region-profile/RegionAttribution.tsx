import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";
import { siteEntityId } from "@/lib/site";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";

const separatorClass = "text-(--nw-sep) lg:hidden";
const lineClass = "lg:mt-0.5 lg:block";

export async function RegionAttribution({
  locale,
  publishedAt,
  updatedAt,
}: {
  locale: AppLocale;
  publishedAt?: string;
  updatedAt?: string;
}) {
  const t = await getTranslations({ locale, namespace: "attribution" });
  const showUpdatedAt = hasMeaningfulUpdate(publishedAt, updatedAt);

  return (
    <aside
      aria-label={t("heading")}
      className="text-[12.5px] leading-[1.6] text-(--nw-muted) lg:rounded-[22px] lg:bg-(--nw-surface) lg:p-5 lg:text-[13.5px] lg:text-(--nw-soft)"
      itemID={siteEntityId("organization")}
      itemScope
      itemType="https://schema.org/Organization"
    >
      <meta content={t("heading")} itemProp="name" />
      {publishedAt ? (
        <>
          <time className="lg:block" dateTime={publishedAt}>
            {t("published", { date: formatContentDate(publishedAt, locale) })}
          </time>
          <span aria-hidden="true" className={separatorClass}>
            {" · "}
          </span>
        </>
      ) : null}
      {showUpdatedAt && updatedAt ? (
        <>
          <time className={lineClass} dateTime={updatedAt}>
            {t("updated", { date: formatContentDate(updatedAt, locale) })}
          </time>
          <span aria-hidden="true" className={separatorClass}>
            {" · "}
          </span>
        </>
      ) : null}
      <span className={lineClass} itemProp="description">
        {t("bodyEditorial")}
      </span>
      <span aria-hidden="true" className={separatorClass}>
        {" · "}
      </span>
      <Link
        className="inline-flex items-center gap-1.5 font-semibold text-(--nw-accent) focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-(--nw-accent) lg:mt-2.5"
        href={{ hash: "methodology", pathname: "/about" }}
      >
        {t("methodology")}
        <ArrowRight
          aria-hidden="true"
          className="hidden size-3.5 lg:block"
          strokeWidth={1.75}
        />
      </Link>
    </aside>
  );
}
