import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species, SpeciesSource } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { CoverImage } from "@/components/CoverImage";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { SourceLink } from "@/components/SourceLink";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";
import { getSpeciesCoverSrc } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

const featuredSourceStarts = [
  "Tarkhnishvili et al. 2026",
  "Iankoshvili & Tarkhnishvili 2021",
  "Aghasyan et al. 2021",
];

type Props = {
  locale: AppLocale;
  publishedAt?: string;
  related: Species[];
  sources: SpeciesSource[];
  speciesId: string;
  updatedAt?: string;
};

export async function SpeciesSourcesRelated({
  locale,
  publishedAt,
  related,
  sources,
  speciesId,
  updatedAt,
}: Props) {
  if (sources.length === 0 && related.length === 0) return null;

  const [t, tDanger, tAttribution] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "danger" }),
    getTranslations({ locale, namespace: "attribution" }),
  ]);
  const giurza = speciesId === "macrovipera-lebetina";
  const insect = getSpeciesAtlasMeta(speciesId).group === "insect";
  const featured = giurza
    ? featuredSourceStarts
        .map((name) => sources.find((source) => source.name.startsWith(name)))
        .filter((source): source is SpeciesSource => Boolean(source))
    : [];
  const featuredNames = new Set(featured.map((source) => source.name));
  const remaining = sources.filter((source) => !featuredNames.has(source.name));
  const visible = featured.length > 0 ? featured : sources.slice(0, 3);
  const hidden = featured.length > 0 ? remaining : sources.slice(3);

  return (
    <section className="bg-surface py-9 lg:py-20">
      <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-10">
        <div>
          <div className="flex items-end justify-between gap-3 px-5 sm:px-6 lg:px-0">
            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("sourcesEyebrow")}
              </p>
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="mt-3 font-display text-[27px] leading-tight font-semibold text-foreground lg:text-[38px]"
                id={SPECIES_SECTION_IDS.sources}
                showAnchor={false}
              >
                {t("sourcesProfileTitle")}
              </AnchoredHeading>
            </div>
            <span className="pb-1 text-[12px] text-muted-foreground lg:hidden">
              {t("sourcesCount", { count: sources.length })}
            </span>
          </div>

          <div className="mx-4 mt-5 rounded-[28px] bg-background px-5 py-1 shadow-[0_14px_36px_rgba(20,32,24,0.05)] sm:mx-6 lg:mx-0 lg:mt-7 lg:px-6">
            {visible.map((source, index) => (
              <SourceRow
                key={source.name}
                source={source}
                speciesId={speciesId}
                withBorder={index > 0}
              />
            ))}
            {hidden.length > 0 ? (
              <details className="group border-t border-border">
                <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-primary marker:content-none lg:min-h-14 lg:text-[15px] [&::-webkit-details-marker]:hidden">
                  {t("moreSources", { count: hidden.length })}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="border-t border-border">
                  {hidden.map((source, index) => (
                    <SourceRow
                      key={source.name}
                      source={source}
                      speciesId={speciesId}
                      withBorder={index > 0}
                    />
                  ))}
                </div>
              </details>
            ) : null}
          </div>

          <p className="mt-4 px-5 text-[12.5px] leading-relaxed text-muted-foreground sm:px-6 lg:px-0 lg:text-[13px]">
            {publishedAt ? (
              <time dateTime={publishedAt}>
                {tAttribution("published", {
                  date: formatContentDate(publishedAt, locale),
                })}
              </time>
            ) : null}
            {updatedAt && hasMeaningfulUpdate(publishedAt, updatedAt) ? (
              <time className="ml-2" dateTime={updatedAt}>
                {tAttribution("updated", {
                  date: formatContentDate(updatedAt, locale),
                })}
              </time>
            ) : null}
          </p>
          <p className="mt-2 px-5 text-[12.5px] leading-relaxed text-muted-foreground sm:px-6 lg:px-0 lg:text-[13px]">
            {t("sourcesNote")}
          </p>
          <p className="mt-2 px-5 text-[12.5px] leading-relaxed text-muted-foreground sm:px-6 lg:px-0 lg:text-[13px]">
            <Link
              className="underline decoration-current/40 underline-offset-2 transition-colors hover:text-foreground"
              href="/about"
              rel="author"
            >
              {tAttribution("body")}
            </Link>
          </p>
        </div>

        {related.length > 0 ? (
          <div className="mt-9 min-w-0 lg:mt-0">
            <div className="flex items-baseline justify-between gap-3 px-5 sm:px-6 lg:px-0">
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="font-display text-[22px] leading-tight font-semibold text-foreground lg:text-[28px]"
                id={SPECIES_SECTION_IDS.related}
                showAnchor={false}
              >
                {insect ? t("otherInsectsTitle") : t("relatedTitle")}
              </AnchoredHeading>
              <Link
                className="shrink-0 text-[13px] font-medium text-primary"
                href={giurza ? "/snakes/saxeoebebi" : "/species"}
              >
                {giurza ? t("allSnakes") : t("allSpecies")}
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-1 inline size-3.5"
                />
              </Link>
            </div>
            <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-2 sm:px-6 lg:mt-6 lg:grid lg:grid-cols-2 lg:gap-x-5 lg:gap-y-7 lg:overflow-visible lg:px-0">
              {related.map((item, index) => (
                <RelatedSpeciesCard
                  item={item}
                  key={item.id}
                  locale={locale}
                  position={index + 1}
                  riskLabels={{
                    Harmless: tDanger("Harmless"),
                    High: tDanger("High"),
                    Moderate: tDanger("Moderate"),
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RelatedSpeciesCard({
  item,
  locale,
  position,
  riskLabels,
}: {
  item: Species;
  locale: AppLocale;
  position: number;
  riskLabels: Record<
    NonNullable<ReturnType<typeof getSpeciesRiskChip>>["level"],
    string
  >;
}) {
  const cover = getSpeciesCoverSrc(item);
  const risk = getSpeciesRiskChip(item);
  return (
    <TrackedSpeciesLink
      className="group block w-[168px] shrink-0 snap-start lg:w-auto"
      locale={locale}
      position={position}
      source="related"
      speciesId={item.id}
    >
      <span className="relative block h-[126px] overflow-hidden rounded-[20px] bg-ink lg:aspect-16/10 lg:h-auto lg:rounded-[22px]">
        {cover ? (
          <CoverImage
            alt={speciesImageAlt(
              item.commonName,
              item.scientificName,
              item.location,
            )}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 360px, 168px"
            src={cover}
          />
        ) : null}
        {risk ? (
          <span className="absolute top-2 left-2 inline-flex h-6 items-center gap-1.5 rounded-full bg-background/95 px-2 text-[10px] font-medium text-foreground lg:top-3 lg:left-3 lg:h-7 lg:px-2.5 lg:text-[11px]">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${risk.level === "High" ? "bg-destructive" : risk.level === "Moderate" ? "bg-gold" : "bg-primary"}`}
            />
            {riskLabels[risk.level]}
          </span>
        ) : null}
      </span>
      <span className="mx-1 mt-2.5 block text-[15px] leading-tight font-semibold text-foreground lg:mt-3 lg:text-[17px]">
        {item.commonName}
      </span>
      <span className="mx-1 mt-0.5 block text-[12px] text-muted-foreground italic lg:text-[13px]">
        {item.scientificName}
      </span>
    </TrackedSpeciesLink>
  );
}

function SourceRow({
  source,
  speciesId,
  withBorder,
}: {
  source: SpeciesSource;
  speciesId: string;
  withBorder: boolean;
}) {
  const [citation, ...titleParts] = source.name.split(" — ");
  const content = (
    <span className="flex items-start justify-between gap-3 py-4 text-[14px] leading-[1.45] text-foreground lg:text-[15px]">
      <span className="min-w-0">
        <strong className="font-semibold">{citation}</strong>
        {titleParts.length > 0 ? ` — ${titleParts.join(" — ")}` : null}
      </span>
      {source.url ? (
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
      ) : null}
    </span>
  );

  return (
    <div className={withBorder ? "border-t border-border" : undefined}>
      {source.url ? (
        <SourceLink href={source.url} speciesId={speciesId}>
          {content}
        </SourceLink>
      ) : (
        content
      )}
    </div>
  );
}
