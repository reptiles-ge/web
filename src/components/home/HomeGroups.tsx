import { CoverImage } from "@/components/CoverImage";
import { getSpeciesById } from "@/data/species";
import {
  getAtlasStats,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";

const FEATURED_HUBS = ["snakes", "lizards", "turtles", "amphibians"] as const;
const QUIET_HUBS = ["birds", "mammals", "spiders"] as const;

function groupCount(
  group: AnimalGroup,
  stats: ReturnType<typeof getAtlasStats>,
) {
  switch (group) {
    case "snake":
      return stats.snakes;
    case "lizard":
      return stats.lizards;
    case "turtle":
      return stats.turtles;
    case "amphibian":
      return stats.amphibians;
    case "bird":
      return stats.birds;
    case "mammal":
      return stats.mammals;
    case "spider":
      return stats.spiders;
  }
}

function hubPhoto(hubId: GroupHubId, locale: AppLocale) {
  const hub = GROUP_HUBS[hubId];
  const species = getSpeciesById(hub.heroSpeciesId);
  if (!species) return null;
  const localized = localizeSpecies(species, locale);
  const src =
    localized.mobileImage && !isPlaceholderMedia(localized.mobileImage)
      ? localized.mobileImage
      : localized.image;
  if (isPlaceholderMedia(src)) return null;
  return {
    src,
    alt: speciesImageAlt(
      localized.commonName,
      localized.scientificName,
      localized.location,
    ),
  };
}

export async function HomeGroups() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.groups");
  const tNav = await getTranslations("nav");
  const stats = getAtlasStats();

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 font-display text-balance-tight text-[clamp(1.65rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/species"
            className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            {t("catalog")}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 sm:mt-16">
          {FEATURED_HUBS.filter((hubId) => hubId === "snakes").map((hubId) => {
            const hub = GROUP_HUBS[hubId];
            const photo = hubPhoto(hubId, locale);
            const count = groupCount(hub.group, stats);
            return (
              <Link
                key={hubId}
                href={hub.path}
                className="group relative block overflow-hidden bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                <div className="relative aspect-[16/11] sm:aspect-[21/9]">
                  {photo ? (
                    <CoverImage
                      src={photo.src}
                      alt={photo.alt}
                      sizes="100vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="text-[11px] tabular-nums tracking-[0.16em] text-white/55">
                      {t("count", { count })}
                    </p>
                    <h3 className="mt-1.5 font-display text-[clamp(1.45rem,2.4vw,2rem)] font-semibold text-white">
                      {tNav(hubId)}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-4">
            {FEATURED_HUBS.filter((hubId) => hubId !== "snakes").map((hubId) => {
              const hub = GROUP_HUBS[hubId];
              const photo = hubPhoto(hubId, locale);
              const count = groupCount(hub.group, stats);
              return (
                <Link
                  key={hubId}
                  href={hub.path}
                  className="group relative block overflow-hidden bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[3/4] sm:aspect-[16/11]">
                    {photo ? (
                      <CoverImage
                        src={photo.src}
                        alt={photo.alt}
                        sizes="(max-width: 639px) 33vw, 33vw"
                        className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-5">
                      <p className="text-[10px] tabular-nums tracking-[0.14em] text-white/55 sm:text-[11px]">
                        {t("count", { count })}
                      </p>
                      <h3 className="mt-1 font-display text-[13px] font-semibold leading-tight text-white sm:text-[1.35rem]">
                        {tNav(hubId)}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <ul className="mt-3 grid gap-px overflow-hidden bg-border/80 sm:grid-cols-3">
          {QUIET_HUBS.map((hubId) => {
            const hub = GROUP_HUBS[hubId];
            const photo = hubPhoto(hubId, locale);
            const count = groupCount(hub.group, stats);

            return (
              <li key={hubId} className="bg-background">
                <Link
                  href={hub.path}
                  className="group flex min-h-20 items-center gap-4 px-4 py-4 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-5"
                >
                  {photo ? (
                    <span className="relative size-14 shrink-0 overflow-hidden bg-ink">
                      <CoverImage
                        src={photo.src}
                        alt=""
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <h3 className="font-display text-[16px] font-semibold text-foreground">
                      {tNav(hubId)}
                    </h3>
                    <p className="mt-0.5 text-[12px] tabular-nums text-muted-foreground">
                      {t("count", { count })}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
