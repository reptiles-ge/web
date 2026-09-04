import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { getSpeciesById } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { speciesSeoAnchor } from "@/lib/seoKeywords";
import {
  filterDisplayStats,
  getSpeciesHeroSources,
  isPlaceholderBody,
  isPlaceholderMedia,
} from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";

const SPOTLIGHT_ID = "vipera-dinniki";
const SPOTLIGHT_IMAGE = "https://cdn.reptiles.ge/vipera-dinniki-truso-2.jpg";
const SUPPORTING_IDS = [
  "pseudopus-apodus",
  "testudo-graeca",
  "mertensiella-caucasica",
] as const;

export async function HomeFeatured() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.featured");
  const tDetail = await getTranslations("detail");
  const base = getSpeciesById(SPOTLIGHT_ID);
  if (!base) return null;

  const spotlight = localizeSpecies(base, locale);
  const hero = getSpeciesHeroSources(spotlight);
  const imageSrc = !isPlaceholderMedia(SPOTLIGHT_IMAGE)
    ? SPOTLIGHT_IMAGE
    : hero.desktopHeroSrc && !isPlaceholderMedia(hero.desktopHeroSrc)
      ? hero.desktopHeroSrc
      : spotlight.image;
  const group = getSpeciesAtlasMeta(spotlight.id).group;
  const stats = filterDisplayStats(spotlight.stats, group).slice(0, 4);
  const supporting = SUPPORTING_IDS.map((id) => getSpeciesById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => localizeSpecies(item, locale))
    .filter((item) => !isPlaceholderMedia(item.image));

  return (
    <section className="bg-surface py-20 lg:py-28" id="species">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="text-balance-tight mt-4 font-display text-display-title font-semibold">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <article className="mt-12 lg:mt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <TrackedSpeciesLink
              aria-label={tDetail("imageAlt")}
              className="group relative block overflow-hidden bg-ink focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
              locale={locale}
              source="home_spotlight"
              speciesId={spotlight.id}
            >
              <div className="relative aspect-4/5 sm:aspect-5/6 lg:aspect-4/5">
                <CoverImage
                  alt={tDetail("imageAlt")}
                  className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  src={imageSrc}
                />
              </div>
            </TrackedSpeciesLink>

            <div className="lg:pb-4">
              <p className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                {tDetail("eyebrow")}
              </p>
              <h3 className="mt-4 font-display text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.08] font-semibold text-foreground">
                {spotlight.commonName}
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground italic">
                {spotlight.scientificName}
              </p>
              <p className="mt-6 max-w-md text-[17px] leading-snug text-foreground/90 sm:text-[18px]">
                {tDetail("lead")}
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {tDetail("body")}
              </p>
              {stats.length > 0 ? (
                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-[11px] tracking-[0.14em] text-muted-foreground">
                        {stat.label}
                      </dt>
                      <dd className="mt-1.5 font-display text-[15px] leading-snug font-medium text-foreground">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <TrackedSpeciesLink
                className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                locale={locale}
                source="home_spotlight"
                speciesId={spotlight.id}
              >
                <span className="border-b border-foreground/25 pb-0.5 transition-colors group-hover:border-foreground">
                  {speciesSeoAnchor(
                    spotlight.commonName,
                    spotlight.scientificName,
                  )}
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </TrackedSpeciesLink>
            </div>
          </div>
        </article>

        {supporting.length > 0 ? (
          <ul className="mt-12 grid gap-8 border-t border-border pt-10 sm:grid-cols-3 sm:gap-6 lg:mt-16 lg:pt-12">
            {supporting.map((species, index) => {
              const cover = !isPlaceholderMedia(species.mobileImage)
                ? species.mobileImage
                : species.image;
              const blurb = isPlaceholderBody(species.description)
                ? null
                : species.description;

              return (
                <li key={species.id}>
                  <TrackedSpeciesLink
                    className="group block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    locale={locale}
                    position={index + 1}
                    source="home_featured"
                    speciesId={species.id}
                  >
                    <div className="relative aspect-4/5 overflow-hidden bg-ink">
                      <CoverImage
                        alt={speciesImageAlt(
                          species.commonName,
                          species.scientificName,
                          species.location,
                        )}
                        className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                        sizes="(max-width: 639px) 100vw, 33vw"
                        src={cover ?? species.image}
                      />
                    </div>
                    <p className="mt-4 text-[13px] text-muted-foreground italic">
                      {species.scientificName}
                    </p>
                    <h3 className="mt-1 font-display text-[1.2rem] leading-tight font-semibold text-foreground">
                      {species.commonName}
                    </h3>
                    {blurb ? (
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                        {blurb}
                      </p>
                    ) : null}
                  </TrackedSpeciesLink>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
