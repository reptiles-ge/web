import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { getSpeciesById } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { images } from "@/data/speciesMedia";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
import { speciesSeoAnchor } from "@/lib/seoKeywords";
import { filterDisplayStats } from "@/lib/speciesContent";

const SPOTLIGHT_ID = "vipera-dinniki";
const SUPPORTING = [
  { id: "pseudopus-apodus", image: GROUP_HUB_ILLUSTRATIONS.lizards },
  { id: "testudo-graeca", image: GROUP_HUB_ILLUSTRATIONS.turtles },
  { id: "mertensiella-caucasica", image: GROUP_HUB_ILLUSTRATIONS.amphibians },
] as const;

export async function HomeFeatured({ locale }: { locale: AppLocale }) {
  const [t, tDetail, tGroups] = await Promise.all([
    getTranslations({ locale, namespace: "home.featured" }),
    getTranslations({ locale, namespace: "detail" }),
    getTranslations({ locale, namespace: "home.groups" }),
  ]);
  const base = getSpeciesById(SPOTLIGHT_ID);
  if (!base) return null;

  const spotlight = localizeSpecies(base, locale);
  const group = getSpeciesAtlasMeta(spotlight.id).group;
  const stats = filterDisplayStats(spotlight.stats, group).slice(0, 4);
  const supporting = SUPPORTING.flatMap(({ id, image }) => {
    const species = getSpeciesById(id);
    return species
      ? [{ image, species: localizeSpecies(species, locale) }]
      : [];
  });

  return (
    <section className="bg-background py-11 lg:py-20" id="species">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <HomeSectionHeading
          eyebrow={t("eyebrow")}
          subtitle={t("subtitle")}
          title={t("title")}
        />

        <article className="mt-6 grid gap-5 lg:mt-11 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <TrackedSpeciesLink
            aria-label={spotlight.commonName}
            className="group relative block h-[248px] overflow-hidden rounded-[24px] bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:h-[360px] lg:h-[440px] lg:rounded-[32px]"
            locale={locale}
            source="home_spotlight"
            speciesId={spotlight.id}
          >
            <CoverImage
              alt={tGroups("illustrationAlt", { name: spotlight.commonName })}
              className="object-cover object-[78%_center] transition-transform duration-700 group-hover:scale-[1.035]"
              sizes="(max-width: 1023px) 100vw, 640px"
              src={images.homeSpotlight}
            />
            <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#1a211c]">
              {tDetail("eyebrow")}
            </span>
          </TrackedSpeciesLink>
          <div className="min-w-0 lg:py-2">
            <h3 className="font-display text-[28px] leading-[1.15] font-semibold text-foreground lg:text-[40px]">
              {spotlight.commonName}
            </h3>
            <p className="mt-1.5 text-[15px] text-muted-foreground italic lg:text-[16px]">
              {spotlight.scientificName}
            </p>
            <p className="mt-4 max-w-xl text-[16px] leading-normal text-foreground lg:mt-[18px] lg:text-[17px]">
              {tDetail("lead")}
            </p>
            <p className="mt-2.5 max-w-xl text-[14px] leading-[1.65] text-muted-foreground lg:text-[15px]">
              {tDetail("body")}
            </p>
            {stats.length > 0 ? (
              <dl className="mt-5 grid grid-cols-2 gap-2.5 lg:mt-6 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    className="rounded-[16px] bg-surface p-3 lg:rounded-[18px] lg:px-4 lg:py-3.5"
                    key={stat.label}
                  >
                    <dt className="text-[11px] tracking-widest text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="mt-1.5 font-display text-[13px] leading-[1.35] font-medium text-foreground lg:text-[14px]">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <TrackedSpeciesLink
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:mt-6"
              locale={locale}
              source="home_spotlight"
              speciesId={spotlight.id}
            >
              <span className="border-b border-foreground/30 pb-0.5">
                {tDetail("viewProfile")}
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only">
                {speciesSeoAnchor(
                  spotlight.commonName,
                  spotlight.scientificName,
                )}
              </span>
            </TrackedSpeciesLink>
          </div>
        </article>

        {supporting.length > 0 ? (
          <ul className="mt-5 grid gap-2.5 lg:mt-9 lg:grid-cols-3 lg:gap-6">
            {supporting.map(({ image, species }, index) => (
              <li key={species.id}>
                <TrackedSpeciesLink
                  className="group flex min-h-[80px] items-center gap-3 rounded-[22px] bg-card p-2.5 shadow-[0_14px_36px_rgba(14,20,17,0.06)] transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-[124px] lg:gap-[18px] lg:rounded-[26px] lg:p-3"
                  locale={locale}
                  position={index + 1}
                  source="home_featured"
                  speciesId={species.id}
                >
                  <span className="relative h-14 w-[84px] shrink-0 overflow-hidden rounded-xl bg-ink lg:h-[100px] lg:w-[150px] lg:rounded-2xl">
                    <CoverImage
                      alt=""
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      sizes="150px"
                      src={image}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] leading-[1.2] font-semibold text-foreground lg:text-[18px]">
                      {species.commonName}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-muted-foreground italic lg:text-[13px]">
                      {species.scientificName}
                    </span>
                  </span>
                </TrackedSpeciesLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
