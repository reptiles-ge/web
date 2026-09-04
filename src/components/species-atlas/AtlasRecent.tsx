"use client";

import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";
import { speciesHref } from "@/lib/speciesRoutes";

export function AtlasRecent({ species }: { species: Species[] }) {
  const t = useTranslations("speciesAtlas");

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-350 px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
            {t("recentEyebrow")}
          </p>
          <h2 className="mt-4 font-display text-display-title font-semibold">
            {t("recentTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {t("recentSubtitle")}
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {species.map((item) => (
            <li key={item.id}>
              <RecentSpeciesRow species={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecentSpeciesRow({ species }: { species: Species }) {
  const t = useTranslations("speciesAtlas");
  const locale = useLocale() as AppLocale;
  const meta = getSpeciesAtlasMeta(species.id);

  return (
    <Link
      className="group flex items-center gap-4 rounded-card border border-border/80 bg-card p-3 transition-colors hover:border-primary/25 sm:gap-5 sm:p-4"
      href={speciesHref(species.id, locale)}
    >
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-2xl bg-ink sm:size-[84px]">
        {(species.mobileImage || species.image) &&
        !(species.mobileImage ?? species.image).includes(
          "species-placeholder",
        ) ? (
          <CoverImage
            alt=""
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="84px"
            src={species.mobileImage ?? species.image}
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-[1.15rem] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
            {species.commonName}
          </h3>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {t(`groups.${meta.group}`)}
          </span>
        </div>
        <p className="mt-1 truncate text-[13px] text-muted-foreground italic">
          {species.scientificName}
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          {t("updatedOn", {
            date: formatContentDate(species.updatedAt, locale),
          })}
        </p>
      </div>
    </Link>
  );
}
