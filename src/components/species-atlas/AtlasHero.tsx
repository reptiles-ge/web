import { getTranslations } from "next-intl/server";

import type { AtlasStats } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";

type AtlasHeroProps = {
  locale: AppLocale;
  stats: AtlasStats;
};

export async function AtlasHero({ locale, stats }: AtlasHeroProps) {
  const t = await getTranslations({ locale, namespace: "speciesAtlas" });
  const meta = t("stats.catalogMeta", {
    photos: stats.photos,
    regions: stats.regions,
  });

  return (
    <section className="bg-background pt-24 lg:pt-33">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-[60px]">
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li>
              <Link href="/">{t("breadcrumbHome")}</Link>
            </li>
            <li>{t("breadcrumbSpecies")}</li>
          </ol>
        </nav>

        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0 lg:max-w-[780px] lg:flex-1">
            <p className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary"
              />
              <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("heroEyebrow")}
              </span>
            </p>
            <h1 className="mt-3 font-display text-[38px] leading-[1.06] font-bold tracking-[-0.02em] text-balance text-foreground lg:mt-[18px] lg:text-[72px] lg:leading-[1.02]">
              {t("title")}
            </h1>
            <p className="mt-3 text-[16px] leading-[1.6] text-foreground/80 lg:mt-5 lg:max-w-[680px] lg:text-[18px]">
              {t("subtitle")}
            </p>
          </div>

          <div className="mt-4 flex items-baseline gap-2.5 lg:mt-0 lg:shrink-0 lg:items-end lg:gap-[18px] lg:pb-1.5">
            <span className="font-display text-[44px] leading-none font-bold tracking-[-0.03em] text-foreground tabular-nums lg:text-[96px] lg:leading-[0.85] lg:tracking-[-0.04em]">
              {stats.total}
            </span>
            <span className="text-[13.5px] text-muted-foreground lg:hidden">
              {t("stats.total")} · {meta}
            </span>
            <span className="hidden pb-1 lg:block">
              <span className="block text-[15px] font-semibold text-foreground">
                {t("stats.catalogTitle")}
              </span>
              <span className="mt-1 block text-[13.5px] text-muted-foreground">
                {meta}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
